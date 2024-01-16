import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    readonly username: string;

    @IsString()
    @MinLength(4)
    readonly password: string;
}
