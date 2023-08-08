import { Exclude, Type } from "class-transformer";
import {
  IsString,
  IsObject,
  IsOptional,
  IsUrl,
  IsNumber,
} from "class-validator";
import { RPCConfig } from "../../schemas/wallet.schema";

export class WalletListDTO {
  @Exclude()
  seed: string;
}

export class GenerateWalletDTO {
  @IsString()
  name: string;
}

export class EditWalletDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  @Type(() => RPCConfig)
  rpcConfig: RPCConfig;
}
