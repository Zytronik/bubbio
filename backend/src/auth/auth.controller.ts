import { Body, Controller, Post, Headers, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto.login';
import { RegisterDto } from './dto/auth.dto.register';
import { JwtAuthGuard } from './jwt/auth.jwt.guard';

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

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    async logout(@Headers('Authorization') token: string, @Req() req) {
        if(token){
            return this.authService.logout(token.replace('Bearer ', ''), req.user.userId);
        }
    }
}
