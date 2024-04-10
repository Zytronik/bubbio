import { IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class CheckUsernameDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(2)
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message: 'Username must contain, numbers, hyphens, and underscores.',
  })
  username: string;
}