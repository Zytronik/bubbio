import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { AuthenticatedRequest } from "src/auth/e/auth.e-auth-request";
import { JwtAuthGuard } from "src/auth/jwt/auth.jwt.guard";

@Controller('friends')
export class FriendsController {
    constructor(
        private friendsService: FriendsService,
    ) { }
    
    @UseGuards(JwtAuthGuard)
    @Get()
    async getFriends(@Req() req: AuthenticatedRequest) {
        return await this.friendsService.getFriends(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('add')
    async addFriend(@Req() req: AuthenticatedRequest, @Body() body: { friendId: number }) {
        try {
            await this.friendsService.addFriend(req.user.userId, body.friendId);
            return { message: 'Freund hinzugefügt.' };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('remove')
    async removeFriend(@Req() req: AuthenticatedRequest, @Body() body: { friendId: number }) {
        try {
            await this.friendsService.removeFriend(req.user.userId, body.friendId);
            return { message: 'Freund entfernt.' };
        } catch (error) {
            throw new HttpException('Friend coudnt be deleted.', HttpStatus.BAD_REQUEST);
        }
    }
}