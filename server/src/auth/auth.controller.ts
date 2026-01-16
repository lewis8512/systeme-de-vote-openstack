import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthAdminDto, AuthDto } from './dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sign in for electors" })
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sign in for admin" })
  @Post('admin/signin')
  adminSignin(@Body() dto: AuthAdminDto) {
    return this.authService.adminSignin(dto);
  }
}
