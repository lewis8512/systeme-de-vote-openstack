import { Module } from '@nestjs/common';
import { ElectionController } from './election.controller';
import { ElectionService } from './election.service';
import { ResultsGateway } from './results/results.gateway';
import { AdminResultsGateway } from './results/admin-results.gateway';

@Module({
  controllers: [ElectionController],
  providers: [ElectionService, ResultsGateway, AdminResultsGateway],
  exports: [ElectionService, ResultsGateway, AdminResultsGateway]
})
export class ElectionModule {}
