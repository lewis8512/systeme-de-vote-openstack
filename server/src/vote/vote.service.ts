import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

import { ResultsGateway } from '../election/results/results.gateway';
import { AdminResultsGateway } from 'src/election/results/admin-results.gateway';

@Injectable()
export class VoteService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly resultsGateway: ResultsGateway,
        private readonly adminResultsGateway: AdminResultsGateway
    ) { }

    async submitVote(electorId: number, candidateId: number) {
        const candidate = await this.prisma.candidate.findUnique({
            where: { id: candidateId },
            include: { election: true },
        });

        if (!candidate) throw new Error("Candidat introuvable");

        // Vérifie si l'électeur a déjà voté dans cette élection
        const existingVote = await this.prisma.vote.findFirst({
            where: {
                electorId,
                electionId: candidate.electionId,
            },
        });

        if (existingVote) {
            throw new ForbiddenException('Vous avez déjà voté pour cette élection.');
        }

        let retries = 0;
        const maxRetries = 5;
        while (retries < maxRetries) {
            try {
                const voteHash = randomUUID();

                // Crée le vote sans savoir pour qui l' électeur a voté
                await this.prisma.vote.create({
                    data: {
                        electorId,
                        electionId: candidate.electionId,
                    },
                });

                // Crée le récépissé de vote
                await this.prisma.receipt.create({
                    data: {
                        voteHash,
                        candidateId,
                        electionId: candidate.electionId,
                    },
                });


                // émet les résultats en temps réel
                const candidates = await this.prisma.candidate.findMany({
                    where: { electionId: candidate.electionId },
                    include: {
                        _count: {
                            select: { receipts: true },
                        },
                    },
                });

                const formattedResults = candidates.map((c) => ({
                    id: c.id,
                    name: `${c.name} ${c.surname}`,
                    party: c.party,
                    votes: c._count.receipts,
                }));

                // Envoie en temps réel aux clients connectés
                this.resultsGateway.emitResults(formattedResults);


                // Calcul des statistiques
                const totalVotes = candidates.reduce((sum, c) => sum + c._count.receipts, 0);
                const totalElectors = await this.prisma.elector.count();
                const participationRate = totalElectors > 0 ? (totalVotes / totalElectors) * 100 : 0;

                const leadingCandidate = candidates.reduce((leader, c) => {
                    return c._count.receipts > (leader?._count.receipts || 0) ? c : leader;
                }, null);

                // Émettre les résultats enrichis pour les administrateurs
                this.adminResultsGateway.emitAdminResults({
                    candidates: formattedResults,
                    totalVotes,
                    totalElectors,
                    participationRate: participationRate.toFixed(2), // Formaté en pourcentage
                    leadingCandidate: leadingCandidate
                        ? {
                            id: leadingCandidate.id,
                            name: `${leadingCandidate.name} ${leadingCandidate.surname}`,
                            votes: leadingCandidate._count.receipts,
                        }
                        : null,
                });



                console.log(`Vote enregistré avec hash : ${voteHash}`);
                return { voteHash };

            } catch (error) {
                if (this.errorIsUniqueConstraintViolation(error)) {
                    retries++;
                    console.warn(`Collision de hash, tentative ${retries}`);
                } else {
                    console.error("Erreur lors du vote :", error);
                    throw error;
                }
            }
        }

        throw new Error("Échec de la génération d'un voteHash unique après 5 tentatives");
    }


    async hasAlreadyVoted(electorId: number) {
        const currentElection = await this.prisma.election.findFirst({
            where: {
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
            },
        });

        if (!currentElection) {
            return { hasVoted: false };
        }

        const existingVote = await this.prisma.vote.findFirst({
            where: {
                electorId,
                electionId: currentElection.id,
            },
        });

        return {
            hasVoted: existingVote !== null,
            votedAt: existingVote?.createdAt ?? null,
        };
    }

    async verifyReceipt(electorId: number, voteHash: string) {
        const currentElection = await this.prisma.election.findFirst({
            where: {
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
            },
        });

        if (!currentElection) return { found: false };

        const receipt = await this.prisma.receipt.findFirst({
            where: {
                voteHash,
                electionId: currentElection.id,
            },
        });

        return { found: receipt !== null };
    }


    private errorIsUniqueConstraintViolation(error: any): boolean {
        return error instanceof PrismaClientKnownRequestError && error.code === 'P2002' // violation de contrainte UNIQUE;
    }
}
