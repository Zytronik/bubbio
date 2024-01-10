import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "../auth.service";

@Injectable()
export class SessionStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService, private prisma: PrismaService){
        super();
    }

   /*  async validate(payload: {sub: number, email: string}){
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });
        delete user.hash;
        return user;
    } */


}