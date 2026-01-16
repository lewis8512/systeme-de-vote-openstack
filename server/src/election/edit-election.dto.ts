import { IsString } from 'class-validator';

export class EditElectionDto {
  @IsString()
  title: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}
