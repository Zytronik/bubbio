import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { UserService } from 'src/user/user.service';
import { AuthenticatedRequest } from 'src/auth/e/auth.e-auth-request';
import { OptionalJwtAuthGuard } from 'src/auth/jwt/auth.jwt.optional-guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('leaderboard')
export class LeaderboardController {
    constructor(
        private leaderboardService: LeaderboardService,
        private userService: UserService,
    ) { }

    @UseGuards(OptionalJwtAuthGuard)
    @Get('data')
    async getLeaderboard(
        @Query('gameMode') gameMode: string,
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: string,
        @Query('category') category: string,
        @Query('country') country: string,
        @Query('limit') limit: string,
        @Req() req: AuthenticatedRequest
    ) {
        const limitInt = parseInt(limit);
        if (!country && req.user && req.user.userId) { //if user is logged in and not country is specified
            country = await this.userService.getUserCountry(req.user.userId);
        }else if(!country){
            category = 'global';
        }

        return this.leaderboardService.getLeaderboardData({
            gameMode,
            sortBy,
            sortDirection,
            category,
            country,
            limit: limitInt,
        });
    }

}