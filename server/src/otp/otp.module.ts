import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { CustomMailerModule } from '../mailer/mailer.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    CustomMailerModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule { }