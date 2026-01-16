import { Module } from '@nestjs/common';
import { ElectorController } from './elector.controller';
import { ElectorService } from './elector.service';

@Module({
  controllers: [ElectorController],
  providers: [ElectorService]
})
export class ElectorModule {}
