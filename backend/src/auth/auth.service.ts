import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto.register';
import { LoginDto } from './dto/auth.dto.login';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private userService: UserService,
    ) { }

    async register(registerDto: RegisterDto): Promise<any> {
        return this.userService.createUser(registerDto); 
    }

    async login(loginDto: LoginDto): Promise<any> {
        const user = await this.userService.getUserByUsername(loginDto.username);

        if (!user) {
            throw new BadRequestException({
                message: ['Invalid credentials'],
                error: 'Bad Request',
                statusCode: 400,
            });
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException({
                message: ['Invalid credentials'],
                error: 'Bad Request',
                statusCode: 400,
            });
        }

        const jti = crypto.randomBytes(16).toString('hex');

        const payload = {
            username: user.username,
            sub: user.id, 
            jti: jti
        };
        const secret = this.configService.get<string>('JWT_SECRET');
        const expi = this.configService.get<string>('JWT_EXI');
        return {
            access_token: this.jwtService.sign(payload, {
                secret,
                expiresIn: expi,
            }),
        };
    }

    async logout(token: string): Promise<void> {
        const decodedToken = this.jwtService.decode(token) as any;

        if (!decodedToken || !decodedToken.jti) {
            throw new BadRequestException({
                message: ['Invalid Logout Token'],
                error: 'Bad Request',
                statusCode: 400,
            });
        }

        const expiresAt = decodedToken.exp ? new Date(decodedToken.exp * 1000) : new Date();
        if (isNaN(expiresAt.getTime())) {
            throw new BadRequestException({
                message: ['Invalid expiration date'],
                error: 'Bad Request',
                statusCode: 400,
            });
        }

        // Check if the tokenJTI is already in the blacklist
        const existingToken = await this.prisma.tokenBlacklist.findUnique({
            where: { tokenJTI: decodedToken.jti },
        });

        if (!existingToken) {
            // If not, blacklist the token
            await this.prisma.tokenBlacklist.create({
                data: {
                    token: token, // The actual token string
                    tokenJTI: decodedToken.jti, // The unique identifier of the token
                    expiresAt: expiresAt, // Token expiry date
                },
            });
        } else {
            throw new BadRequestException({
                message: ['User already logged out'],
                error: 'Bad Request',
                statusCode: 400,
            });
        }
    }

}