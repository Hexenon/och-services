import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { User } from "./user.schema";
import { ModuleModel } from "./module.schema";

export type UserModuleDocument = HydratedDocument<UserModule>;

type Primitive = boolean | string | number;

export type ModuleConfig = Record<string, Primitive | Array<Primitive>>;

@Schema()
export class UserModule {
  @Prop({ type: SchemaTypes.ObjectId, ref: "User" })
  user: User;
  @Prop({ type: SchemaTypes.ObjectId, ref: "ModuleModel" })
  module: ModuleModel;
  @Prop({ required: true, type: SchemaTypes.Mixed })
  config: ModuleConfig;
}

export const UserModuleSchema = SchemaFactory.createForClass(UserModule);
