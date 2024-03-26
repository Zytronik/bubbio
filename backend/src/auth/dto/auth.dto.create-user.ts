import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, isEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    readonly password: string;

    @IsEmail()
    @IsOptional()
    readonly email?: string;
}
