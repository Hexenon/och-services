import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { passwordRegex } from './register';

export class ResetPasswordDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(passwordRegex)
  password: string;

  @IsString()
  code: string;
}
