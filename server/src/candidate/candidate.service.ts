import { Injectable } from '@nestjs/common';
import { Multer } from 'multer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCandidateDto } from './create-candidate.dto';
import * as csvParser from 'csv-parser';
import { updateCandidateDto } from './update-candidate.dto';

@Injectable()
export class CandidateService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllCandidatesForCurrentElection() {

        const now = new Date();
        const election = await this.prisma.election.findFirst({
          where: {
            startDate: { lte: now },
            endDate: { gte: now },
          },
        });
        if (!election) return [];
    
        const candidates = await this.prisma.candidate.findMany({
            where: { electionId: election.id },
            include: {
                election: true,
            },
        });
        if (!candidates) return null;

        return candidates.map((candidate) => ({
            id: candidate.id,
            name: candidate.name,
            surname: candidate.surname,
            party: candidate.party,
            image: candidate.image
        }));
    }

    async getCandidatesByElection(id: string) {
        const candidates = await this.prisma.candidate.findMany({
            where: { electionId: Number(id) },
            include: {
                election: true,
            },
        });
        if (!candidates) return null;

        return candidates.map((candidate) => ({
            id: candidate.id,
            name: candidate.name,
            surname: candidate.surname,
            party: candidate.party,
            image: candidate.image
        }));
    }


    async getCandidateById(id: string) {
        const candidate = await this.prisma.candidate.findUnique({
            where: { id: Number(id) },
            include: {
                election: true,
            },
        });
        if (!candidate) return null;

        return {
            id: candidate.id,
            name: candidate.name,
            surname: candidate.surname,
            party: candidate.party,
            image: candidate.image,
            electionId: candidate.electionId,
        };
    }


    async importCSV(file: Multer.File, electionId: string) {
        const results: any[] = [];

        return new Promise((resolve, reject) => {
            const stream = require('stream');
            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);

            bufferStream
                .pipe(csvParser())
                .on('data', (data: any) => results.push(data))
                .on('end', async () => {
                    try {
                        for (const candidate of results) {
                            await this.prisma.candidate.create({
                                data: {
                                    name: candidate.name,
                                    surname: candidate.surname,
                                    party: candidate.party,
                                    image: null, // Image non disponible via CSV
                                    electionId: Number(electionId),
                                },
                            });
                        }
                        resolve({ message: 'Candidates imported successfully' });
                    } catch (error) {
                        reject(error);
                    }
                });
        });
    }

    async createCandidate(dto: CreateCandidateDto, photo: Multer.File) {
        const { name, surname, party, electionId } = dto;

        const candidate = await this.prisma.candidate.create({
            data: {
                name,
                surname,
                party,
                image: photo?.buffer ?? null,
                electionId: Number(electionId),
            },
        });

        return candidate;
    }
    
    async updateCandidate(id: string, dto: updateCandidateDto, image: Multer.File) {
        const { name, surname, party } = dto;

        const candidate = await this.prisma.candidate.update({
            where: { id: Number(id) },
            data: {
                name,
                surname,
                party,
                ...(image ? { image: image.buffer } : {}),
            },
        });

        return candidate;
    }
}
