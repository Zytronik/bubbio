import { IsString } from 'class-validator';

export class UpdateSettingsDto {
    @IsString()
    settings: string;
}