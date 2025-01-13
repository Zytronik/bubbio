import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from 'src/user/user.module';
import { RankedModule } from 'src/ranked/ranked.module';

@Module({
    imports: [PrismaModule, UsersModule, RankedModule],
    controllers: [LeaderboardController],
    providers: [LeaderboardService],
})
export class LeaderboardModule { }
