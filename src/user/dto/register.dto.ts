import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  password: string;
}
