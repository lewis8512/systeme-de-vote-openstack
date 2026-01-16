import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ElectionService {
  constructor(private readonly prisma: PrismaService) { }

  async getCurrentElection() {
    const now = new Date();

    const election = await this.prisma.election.findFirst({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    if (!election) return null;

    return {
      title: election.title,
      startDate: election.startDate,
      endDate: election.endDate,
    };
  }

  async getResultsForCurrentElection() {

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
        _count: {
          select: { receipts: true },
        },
      },
    });

    return candidates.map((c) => ({
      id: c.id,
      name: `${c.name} ${c.surname}`,
      party: c.party,
      votes: c._count.receipts,
    }));
  }

  async getElectionById(id: string) {
    const election = await this.prisma.election.findUnique({
      where: { id: Number(id) },
    });

    if (!election) return null;

    return {
      title: election.title,
      startDate: election.startDate,
      endDate: election.endDate,
    };
  }

  async getAdminResultsForCurrentElection() {
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
        _count: {
          select: { receipts: true },
        },
      },
    });

    const totalVotes = candidates.reduce((sum, c) => sum + c._count.receipts, 0);

    const totalElectors = await this.prisma.elector.count(); // Nombre total d'électeurs inscrits

    const participationRate = totalElectors > 0 ? (totalVotes / totalElectors) * 100 : 0;

    // Trouver le candidat en tête
    const leadingCandidate = candidates.reduce((leader, candidate) => {
      return candidate._count.receipts > (leader?._count.receipts || 0) ? candidate : leader;
    }, null);

    return {
      candidates: candidates.map((c) => ({
        id: c.id,
        name: `${c.name} ${c.surname}`,
        party: c.party,
        votes: c._count.receipts,
      })),
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
    };
  }

  async getAllElections() {
    return await this.prisma.election.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  async createElection(election: { title: string; startDate: Date; endDate: Date }) {
    return this.prisma.election.create({
      data: {
        title: election.title,
        startDate: election.startDate,
        endDate: election.endDate,
      },
    });
  }
  
  async editElection(id: string, election: { title: string; startDate: Date; endDate: Date }) {
    return this.prisma.election.update({
      where: { id: Number(id) },
      data: {
        title: election.title,
        startDate: election.startDate,
        endDate: election.endDate,
      },
    });
  }
}
