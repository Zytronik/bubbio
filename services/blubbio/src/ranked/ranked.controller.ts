import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/auth.jwt.guard';
import { AuthenticatedRequest } from 'src/auth/e/auth.e-auth-request';
import { RankedService } from './ranked.service';

@Controller('ranked')
export class RankedController {
    constructor(
        private rankedService: RankedService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('history')
    async getHistory(@Req() req: AuthenticatedRequest) {
        return await this.rankedService.getHistory(req.user.userId);
    }

}
