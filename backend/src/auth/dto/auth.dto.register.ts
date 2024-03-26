import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    @MinLength(2)
    @Matches(/^[a-z0-9-_]+$/, {
        message: 'Username must contain only lowercase letters, numbers, hyphens, and underscores.',
    })
    readonly username: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    readonly password: string;
}
