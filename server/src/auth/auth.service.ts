import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthAdminDto, AuthDto } from './dto';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) { }

  async signin(dto: AuthDto) {

    // find the user by CNI
    const user =
      await this.prisma.elector.findUnique({
        where: {
          idCardNumber: dto.idCardNumber,
        },
      });
    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    // compare password
    const pwMatches = await verify(
      user.password,
      dto.password,
    );
    // if password incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }
    return this.signToken(user.id, user.idCardNumber);
  }

  async adminSignin(dto: AuthAdminDto) {
    // find the user by CNI
    const admin =
      await this.prisma.admin.findUnique({
        where: {
          email: dto.email,
        },
      });
    // if user does not exist throw exception
    if (!admin) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    // compare password
    const pwMatches = await verify(
      admin.password,
      dto.password,
    );
    // if password incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }
    return this.signAdminToken(admin.id, admin.email);
  }

  async signAdminToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      role: 'admin',
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '60m',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }

  async signToken(
    userId: number,
    idCardNumber: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      role: 'elector',
      sub: userId,
      idCardNumber,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }
}
