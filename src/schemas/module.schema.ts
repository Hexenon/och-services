import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import slugify from "slugify";

export type ModuleDocument = HydratedDocument<ModuleModel>;

export class RPCConfig {
  url: string;
  chainId: number;
}

@Schema({ collection: "modules" })
export class ModuleModel {
  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  status: Boolean;

  @Prop({ unique: true })
  slug: string;
}

export const ModuleSchema = SchemaFactory.createForClass(ModuleModel);
ModuleSchema.pre<ModuleDocument>("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
