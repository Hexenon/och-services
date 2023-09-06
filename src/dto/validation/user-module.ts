import { IsString, IsObject } from "class-validator";
import { ModuleConfig } from "../../schemas/user-module.schema";
import { Type } from "class-transformer";

export class ConfigModuleDTO {
  @IsObject()
  @Type(() => Object)
  config: ModuleConfig;
}
