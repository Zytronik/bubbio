import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) { }
    /*  async signup(dto: LoginDto){
         const hash = await argon.hash(dto.password);
         try{
             const user = await this.prisma.user.create({
                 data: {
                     email: dto.email,
                     hash: hash,
                 }
             });
 
             return this.validateUser(user.id, user.email);
             
         }catch(error){
             if(error instanceof PrismaClientKnownRequestError){
                 if(error.code === "P2002"){
                     throw new ForbiddenException('Credentials taken');
                 }
             }
             throw error;
         }  
     }
 
     async signin(dto: LoginDto){
         const user = await this.prisma.user.findFirst({
             where: {
                 email: dto.email,
             },
         });
 
         if (!user) {
             throw new ForbiddenException(
                 'Credentials incorrect',
             );
         }
 
         // compare password
         const pwMatches = await argon.verify(
             user.hash,
             dto.password,
         );
 
         // if password incorrect throw exception
         if (!pwMatches) {
             throw new ForbiddenException(
                 'Credentials incorrect',
             );
         }
 
         return this.validateUser(user.id, user.email);
     } */

    private readonly USERNAME = 'user';
    private readonly PASSWORD = 'pass';

    login(req: Request, username: string, password: string): boolean {
        const isValid = this.validateUser(username, password);
        if (isValid) {
            req.session.user = { username };
            return true;
        } else {
            return false;
        }
    }

    logout(req: Request): void {
        req.session.destroy((err) => {
            // handle error
        });
    }

    validateUser(username: string, password: string): boolean {
        return username === this.USERNAME && password === this.PASSWORD;
    }
}