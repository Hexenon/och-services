import { IsEmail, IsString } from 'class-validator';

export class VerifyEmailDTO {
  @IsString()
  code: string;

  @IsEmail()
  email: string;
}
