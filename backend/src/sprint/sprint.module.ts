import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from 'src/user/user.module';
import { NewsModule } from 'src/news/news.module';

@Module({
  exports: [SprintService],
  controllers: [SprintController],
  providers: [SprintService, PrismaService],
  imports: [UsersModule, NewsModule],
})
export class SprintModule {}
