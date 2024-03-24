import { Controller, Get, UseGuards, Post, Body, Request, Query, Req } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { JwtAuthGuard } from 'src/auth/jwt/auth.jwt.guard';
import { AuthenticatedRequest } from 'src/auth/auth.e-authRequest';
import { SubmitSprintDto } from './dto/dto.submit-sprint-dto';
import { ModDetail } from 'src/leaderboard/leaderboard.i.mods';

@Controller('sprint')
export class SprintController {
  constructor(private readonly sprintService: SprintService) { }

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submitGameStats(@Request() req: AuthenticatedRequest, @Body() submitSprintDto: SubmitSprintDto) {
    return await this.sprintService.saveGameStats(req.user.userId, submitSprintDto);
  }

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
  async getPersonalBest(@Query('mods') mods: ModDetail[], @Request() req: AuthenticatedRequest) {
    return await this.sprintService.getPersonalBest(req.user.userId, mods);
  }
}
