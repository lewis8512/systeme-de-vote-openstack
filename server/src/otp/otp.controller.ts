import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
    constructor(private readonly otpService: OtpService) { }

    @Post('request')
    requestOtp(@Body() body: { idCardNumber: string; password: string }) {
        return this.otpService.requestOtp(body.idCardNumber, body.password);
    }

    @Post('verify')
    verifyOtp(@Body() body: { idCardNumber: string; otp: string }) {
        return this.otpService.verifyOtp(body.idCardNumber, body.otp);
    }
}