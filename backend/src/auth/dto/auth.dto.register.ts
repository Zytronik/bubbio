import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(2)
    readonly username: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    readonly password: string;
}
