import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import Document from "@nestjs/mongoose";
import { Types } from "mongoose";

export type AuthCodesDocument = AuthCodes &
  Document & {
    _id: Types.ObjectId;
  };

export const isCodeValid = (loginCode: AuthCodes) => {
  // check if code is generated in the last 15 minutes
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  return loginCode.createdAt > fifteenMinutesAgo;
};

export enum CodeType {
  register = "register",
  forgot_password = "forgot_password",
}

@Schema({ autoIndex: true })
export class AuthCodes {
  @Prop()
  email: string;
  @Prop({ required: true, index: true })
  code: string;

  @Prop({ required: true, default: CodeType.register })
  type: CodeType;

  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const AuthCodesSchema = SchemaFactory.createForClass(AuthCodes);
