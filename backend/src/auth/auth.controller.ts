import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto";
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Req() req: Request, @Body() loginDto: LoginDto): string {
        const { username, password } = loginDto;
        if (this.authService.login(req, username, password)) {
            return 'Login Successful';
        } else {
            return 'Invalid Credentials';
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get('logout')
    logout(@Req() req: Request) {
        this.authService.logout(req);
        return 'Logged out successfully';
    }
}