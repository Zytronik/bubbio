import { Controller, Get, UseGuards, Request, Query, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/auth.jwt.guard';
import { AuthenticatedRequest } from 'src/auth/e/auth.e-auth-request';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) { }

  @Get('totalGames')
  async getTotalGamesPlayed() {
    return await this.scoreService.getTotalGamesPlayed();
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('limit') limit: string,
    @Req() req: AuthenticatedRequest) {
    const limitInt = parseInt(limit);

    return this.scoreService.getHistory({
      userId: req.user.userId,
      sortBy,
      sortDirection,
      limit: limitInt,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('personalBest')
  async getPersonalBest(@Request() req: AuthenticatedRequest) {
    return await this.scoreService.getPersonalBest(req.user.userId);
  }
}
