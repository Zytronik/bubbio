import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from 'src/user/user.module';
import { NewsModule } from 'src/news/news.module';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';

@Module({
  exports: [ScoreService],
  controllers: [ScoreController],
  providers: [ScoreService, PrismaService],
  imports: [UsersModule, NewsModule],
})
export class ScoreModule {}
