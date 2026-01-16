import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: {
    sub: number;
    email: string;
    role: 'admin' | 'elector';
  }) {
    if (payload.role === 'elector') {
      const elector = await this.prisma.elector.findUnique({
        where: { id: payload.sub },
      });
  
      if (!elector) return null;
      delete elector.password;
  
      return {
        ...elector,
        role: 'elector',
      };
    }
  
    if (payload.role === 'admin') {
      const admin = await this.prisma.admin.findUnique({
        where: { id: payload.sub },
      });
      if (!admin) return null;
      delete admin.password;
  
      return {
        ...admin,
        role: 'admin',
      };
    }
  
    return null; // au cas où le role est inconnu
  }
  
}
