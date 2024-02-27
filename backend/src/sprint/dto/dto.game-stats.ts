import { IsInt, IsNumber, Min } from 'class-validator';

export class GameStatsDto {
    @IsInt()
    @Min(0)
    sprintTime: number;

    @IsInt()
    @Min(0)
    bubblesCleared: number;

    @IsInt()
    @Min(0)
    bubblesShot: number;

    @IsNumber()
    @Min(0)
    bubblesPerSecond: number;
}
