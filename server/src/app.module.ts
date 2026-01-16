import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ElectorModule } from './elector/elector.module';
import { PrismaModule } from './prisma/prisma.module';
import { ElectionModule } from './election/election.module';
import { CandidateModule } from './candidate/candidate.module';
import { VoteModule } from './vote/vote.module';
import { OtpModule } from './otp/otp.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    AuthModule,
    ElectorModule,
    PrismaModule,
    ElectionModule,
    CandidateModule,
    VoteModule,
    OtpModule,
    MailerModule,
  ],
})
export class AppModule { }
