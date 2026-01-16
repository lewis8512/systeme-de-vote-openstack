import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
} from 'class-validator';

export class SubmitVoteDto {
  @ApiProperty({
    description: 'ID of the selected candidate',
    example: 3,
  })
  @IsNumber()
  candidateId: number;
}