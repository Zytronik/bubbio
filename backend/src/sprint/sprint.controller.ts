import { Controller, Get, UseGuards, Post, Body, Request, Query, Req, Param } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { JwtAuthGuard } from 'src/auth/jwt/auth.jwt.guard';
import { AuthenticatedRequest } from 'src/auth/e/auth.e-auth-request';

@Controller('sprint')
export class SprintController {
  constructor(private readonly sprintService: SprintService) { }

  @Get('totalGames')
  async getTotalGamesPlayed() {
    return await this.sprintService.getTotalGamesPlayed();
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('limit') limit: string,
    @Req() req: AuthenticatedRequest) {
    const limitInt = parseInt(limit);

    return this.sprintService.getHistory({
      userId: req.user.userId,
      sortBy,
      sortDirection,
      limit: limitInt,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('personalBest')
  async getPersonalBest(@Request() req: AuthenticatedRequest) {
    return await this.sprintService.getPersonalBest(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('record/:sprintId')
  async getSprint(@Param('sprintId') sprintId: string) {
    return await this.sprintService.getSprint(sprintId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('werkschauLeaderboard')
  async getWerkschauLeaderboard() {
    return await this.sprintService.getWerkschauLeaderboard();
  }
}
