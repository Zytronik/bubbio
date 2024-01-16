import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto.register';
import { LoginDto } from './dto/auth.dto.login';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async register(registerDto: RegisterDto): Promise<any> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                username: registerDto.username, // Ensure this matches your DTO and Prisma schema
                password: hashedPassword,
            },
        });
        delete user.password; // Remove password from the response
        return user;
    }

    async login(loginDto: LoginDto): Promise<any> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { username: loginDto.username },
            });

            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            // Define the payload for the JWT
            const payload = { username: user.username, sub: user.id };
            const secret = this.configService.get<string>('JWT_SECRET'); // Get secret from ConfigService
            return {
                access_token: this.jwtService.sign(payload, { secret }),
            };
        } catch (error) {
            console.error(error);
            throw new Error('An error occurred during login');
        }
    }

}