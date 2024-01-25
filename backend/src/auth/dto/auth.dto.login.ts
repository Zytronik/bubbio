import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    readonly password: string;
}
