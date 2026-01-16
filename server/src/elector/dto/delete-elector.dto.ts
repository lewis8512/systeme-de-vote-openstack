import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class DeleteElectorDto {
  @ApiProperty({ example: 6, description: "ID de l'électeur à supprimer" })
  @IsInt({ message: 'L’ID doit être un entier.' })
  @Min(1, { message: 'L’ID doit être supérieur ou égal à 1.' })
  id: number;
}
