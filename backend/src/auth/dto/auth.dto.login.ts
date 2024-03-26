import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 15)
    readonly username: string;

    @IsString()
    @MinLength(4)
    @IsNotEmpty()
    readonly password: string;
}
