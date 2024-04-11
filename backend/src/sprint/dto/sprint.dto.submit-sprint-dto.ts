import { IsInt, IsJSON, IsNumber, IsString, Min } from 'class-validator';

export class SubmitSprintDto {
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