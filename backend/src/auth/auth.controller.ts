import { Body, Controller, Post, Headers, HttpCode, HttpStatus, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto.login';
import { RegisterDto } from './dto/auth.dto.register';
import { JwtAuthGuard } from './jwt/auth.jwt.guard';
import { AuthenticatedRequest } from './e/auth.e-auth-request';
import { ForgotPwDto } from './dto/auth.dto.forgot-pw';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
        return this.authService.register(registerDto, this.authService.getClientIp(req));
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPwDto: ForgotPwDto) {
        return this.authService.forgotPassword(forgotPwDto.email);
    }

    @Post('verify-token')
    async verifyToken(@Body('token') token: string) {
        return this.authService.verifyToken(token);
    }

    @Post('change-password')
    async changePassword(@Body() body: { token: string; password: string }): Promise<any> {
        console.log(body.token, body.password);
        if (!body.token || !body.password) {
            throw new BadRequestException({
                message: ['Missing token or New Password'],
                error: 'Bad Request',
                statusCode: 400,
            });
        }
        await this.authService.changePassword(body.token, body.password);
        return { message: 'Password successfully changed' };
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    async logout(@Headers('Authorization') token: string, @Req() req: AuthenticatedRequest) {
        if (token) {
            return this.authService.logout(token.replace('Bearer ', ''), req.user.userId);
        }
    }
}
