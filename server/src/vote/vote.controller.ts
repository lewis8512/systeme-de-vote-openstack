import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SubmitVoteDto } from './dto';
import { GetElector } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard) // protect this route with JWT authentication
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) { }

  @ApiBearerAuth() // inform Swagger that this endpoint requires authentication
  @ApiOperation({ summary: "Submit vote for a candidate" })
  @Post()
  vote(@GetElector('id') electorId: number, @Body() dto: SubmitVoteDto) {
    return this.voteService.submitVote(electorId, dto.candidateId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Check if elector has already voted in the current election" })
  @Get('status')
  getVoteStatus(@GetElector('id') electorId: number) {
    return this.voteService.hasAlreadyVoted(electorId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Check if a vote is present in the ballot box" })
  @Get("verify/:voteHash")
  verifyReceipt(@GetElector('id') electorId: number, @Param('voteHash') voteHash: string) {
    return this.voteService.verifyReceipt(electorId, voteHash);
  }



}
