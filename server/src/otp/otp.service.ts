import { ForbiddenException, Injectable } from '@nestjs/common';
import { MailService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { verify } from 'argon2';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OtpService {
    private otpStore = new Map<string, { otp: string; expiresAt: number }>();

    constructor(
        private readonly mailService: MailService,
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async requestOtp(idCardNumber: string, password: string) {
        const user = await this.prisma.elector.findUnique({ where: { idCardNumber } });
        if (!user) throw new ForbiddenException('Utilisateur introuvable');

        const pwValid = await verify(user.password, password);
        if (!pwValid) throw new ForbiddenException('Mot de passe incorrect');

        const otp = randomInt(100000, 999999).toString();
        const dateExpire = new Date();
        dateExpire.setMinutes(dateExpire.getMinutes() + 5);
        const expiresAt = dateExpire.getTime();

        this.otpStore.set(idCardNumber, { otp, expiresAt });

        // === MODE PRODUCTION: Envoi par email ===
        // await this.mailService.sendOtp(user.email, otp);
        // return { message: 'OTP envoyé à votre adresse email' };

        // === MODE DEMO: OTP affiché dans la console au lieu d'être envoyé par email ===
        console.log(`\n========================================`);
        console.log(`[DEMO] OTP pour ${user.email}: ${otp}`);
        console.log(`========================================\n`);

        // Retourne l'OTP dans la réponse pour affichage côté client
        return {
            message: 'OTP envoyé (mode démo)',
            demoOtp: otp,
            demoMode: true
        };
    }

    async verifyOtp(idCardNumber: string, otp: string) {
        const entry = this.otpStore.get(idCardNumber);
        if (!entry) throw new ForbiddenException('Aucun OTP trouvé');

        if (Date.now() > entry.expiresAt) {
            this.otpStore.delete(idCardNumber);
            throw new ForbiddenException('OTP expiré');
        }

        if (entry.otp !== otp) {
            throw new ForbiddenException('OTP incorrect');
        }

        this.otpStore.delete(idCardNumber);
        const user = await this.prisma.elector.findUnique({ where: { idCardNumber } });

        if (!user) {
            throw new ForbiddenException('Utilisateur introuvable');
        }

        // Génération du token JWT
        const payload = {
            role: 'elector',
            sub: user.id,
            idCardNumber: user.idCardNumber,
        };
        const secret = process.env.JWT_SECRET; // Assurez-vous que JWT_SECRET est défini dans votre configuration
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret,
        });

        return { access_token: token };
    }
}