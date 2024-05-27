import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { subDays } from 'date-fns';

@Injectable()
export class RdUpdateService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateRdValues() {
    const sevenDaysAgo = subDays(new Date(), 7);

    // Get all users
    const users = await this.prisma.user.findMany({
      include: {
        rankedGamesAsUser1: {
          select: { submittedAt: true },
          orderBy: { submittedAt: 'desc' },
          take: 1,
        },
        rankedGamesAsUser2: {
          select: { submittedAt: true },
          orderBy: { submittedAt: 'desc' },
          take: 1,
        },
      },
    });

    // Process each user to update their RD if needed
    for (const user of users) {
      const lastGame1 = user.rankedGamesAsUser1[0]?.submittedAt;
      const lastGame2 = user.rankedGamesAsUser2[0]?.submittedAt;
      const lastPlayed = lastGame1 > lastGame2 ? lastGame1 : lastGame2;

      if ((!lastPlayed || new Date(lastPlayed) < sevenDaysAgo) && user.ratingDeviation < 250) {
        // Update the RD value for the user, ensuring it does not exceed 250
        await this.prisma.user.update({
          where: { id: user.id },
          data: { ratingDeviation: { increment: 1 } },
        });
      }
    }
  }
}
