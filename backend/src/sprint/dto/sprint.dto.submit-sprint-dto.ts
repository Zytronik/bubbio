import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsJSON, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

export class SprintStatsDto {
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

    @IsInt()
    @Min(0)
    clear3: number

    @IsInt()
    @Min(0)
    clear4: number

    @IsInt()
    @Min(0)
    clear5: number

    @IsInt()
    @Min(0)
    clear3wb: number

    @IsInt()
    @Min(0)
    clear4wb: number

    @IsInt()
    @Min(0)
    clear5wb: number

    @IsJSON()
    bpsGraph: string;
}

export class SubmitSprintDto {
    @ValidateNested()
    @Type(() => SprintStatsDto)
    submitStats: SprintStatsDto;

    @IsJSON()
    mods: string;
}