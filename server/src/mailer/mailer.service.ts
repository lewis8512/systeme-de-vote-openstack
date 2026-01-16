import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendOtp(to: string, otp: string) {
        await this.mailerService.sendMail({
            to,
            subject: 'Votre code de vérification',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Votre code de vérification</h2>
                    <p>Bonjour,</p>
                    <p>Voici votre code de connexion :</p>
                    <div style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 10px 0;">
                        ${otp}
                    </div>
                    <p>Ce code est valide pendant <strong>5 minutes</strong>.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #888;">
                        Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.
                    </p>
                </div>
            `,
        });
    }
}
