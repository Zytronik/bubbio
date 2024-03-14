import { IsInt, IsJSON, IsNumber, Min } from 'class-validator';

export class GameStatsDto {
    @IsInt()
    @Min(0)
    bubblesCleared: number;

    @IsInt()
    @Min(0)
    bubblesShot: number;

    @IsNumber()
    @Min(0)
    bubblesPerSecond: number;

    @IsInt()
    @Min(0)
    gameDuration: number;

    @IsInt()
    @Min(0)
    highestBubbleClear: number;

    @IsInt()
    @Min(0)
    wallBounces: number;

    @IsInt()
    @Min(0)
    wallBounceClears: number;

    @IsInt()
    @Min(0)
    highestCombo: number;

    @IsInt()
    @Min(0)
    keysPressed: number;

    @IsNumber()
    @Min(0)
    keysPerSecond: number;
    
    @IsNumber()
    @Min(0)
    keysPerBubble: number;

    @IsNumber()
    @Min(0)
    angleChanged: number;

    @IsNumber()
    @Min(0)
    angleChangePerBubble: number;
    
    @IsInt()
    @Min(0)
    holds: number;

    @IsInt()
    @Min(0)
    bubbleClearToWin: number;

    @IsJSON()
    bubbleClearStats: string;

}   
