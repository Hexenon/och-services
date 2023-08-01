import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.!@#$%^&*])(?=.{8,})/;
export class RegisterDTO {
  @IsString()
  nickname: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(passwordRegex)
  password: string;
}
