import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { ElectionModule } from 'src/election/election.module';

@Module({
  imports: [ElectionModule],
  controllers: [VoteController],
  providers: [VoteService]
})
export class VoteModule { }
