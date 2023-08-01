import { IsString, Matches } from 'class-validator';

export class LinkWalletDTO {
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'INVALID_WALLET' })
  wallet: string;

  @IsString()
  signature: string;
}
