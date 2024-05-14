import { Module } from '@nestjs/common';
import { MatchmakingSimulationGateway } from './matchmakingSimulation.gateway';
import { MatchmakingSimulationService } from './matchmakingSimulation.service';
import { RankedModule } from 'src/ranked/ranked.module';

@Module({
    providers: [MatchmakingSimulationGateway, MatchmakingSimulationService],
})
export class MatchmakingSimulationModule { }
