import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CheckUsernameDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 15)
  username: string;
}