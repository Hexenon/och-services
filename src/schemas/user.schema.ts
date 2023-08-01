import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;
export enum UserStatus {
  UNVERIFIED = "unverified",
  VERIFIED = "verified",
}

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 10 })
  maxWallets: number;

  @Prop({ required: true, default: UserStatus.UNVERIFIED })
  status: UserStatus;

  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
