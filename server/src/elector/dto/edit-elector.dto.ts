import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class EditElectorDto {
  @ApiProperty({ example: 6 })
  @IsOptional()
  id?: number;

  @ApiProperty({example: "John"})
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({example: "Doe"})
  @IsString()
  @IsOptional()
  surname?: string;

  @ApiProperty({example: "123456789"})
  @IsString()
  @IsOptional()
  idCardNumber?: string;

  @ApiProperty({example: "Lannion"})
  @IsString()
  @IsOptional()
  birthPlace?: string;

  @ApiProperty({example: "2023-10-01T00:00:00.000Z"})
  @IsString()
  @IsOptional()
  birthDate?: Date;

  @ApiProperty({example: "test@test.fr"})
  @IsString()
  @IsOptional()
  email?: string;
}
