import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  idCardNumber: string;

  @ApiProperty({ example: 'test1234' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthAdminDto {
  @ApiProperty({example: 'test@gouv.fra'})
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({example: 'test1234'})
  @IsString()
  @IsNotEmpty()
  password: string;
}