import { IsString } from 'class-validator';

export class CreateElectionDto {
  @IsString()
  title: string;

  @IsString()
  startDate: Date;

  @IsString()
  endDate: Date;
}
