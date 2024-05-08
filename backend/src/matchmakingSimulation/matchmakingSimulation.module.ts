import { Module } from '@nestjs/common';
import { MatchmakingSimulationGateway } from './matchmakingSimulation.gateway';
import { MatchmakingSimulationService } from './matchmakingSimulation.service';

@Module({
    providers: [MatchmakingSimulationGateway, MatchmakingSimulationService],
})
export class MatchmakingSimulationModule { }
