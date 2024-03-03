import { IsString } from 'class-validator';

export class UpdateInputSettingsDto {
    @IsString()
    inputSettings: string;
}