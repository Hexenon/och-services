import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "./user.schema";
import { encrypt, decrypt } from "../utils/crypto";

export type WalletDocument = HydratedDocument<Wallet>;

export interface RPCConfig {
  url: string;
  chainId: number;
}

@Schema()
export class Wallet {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  privateKey: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  user: User;

  @Prop({ required: true, type: Object })
  rpcConfig: RPCConfig;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
WalletSchema.pre<WalletDocument>("save", function (next) {
  this.privateKey = encrypt(this.privateKey);
  next();
});

WalletSchema.post<WalletDocument>("init", function () {
  this.privateKey = decrypt(this.privateKey);
});
