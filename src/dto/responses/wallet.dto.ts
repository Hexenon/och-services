import { Exclude } from "class-transformer";
import { IsString, IsObject } from "class-validator";

export class WalletListDTO {
  @Exclude()
  privateKey: string;
}
