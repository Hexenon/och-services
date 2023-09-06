import { Module } from "@nestjs/common";
import { ModuleController } from "./module.controller";
import { ModuleService } from "./module.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModuleModel, ModuleSchema } from "../schemas/module.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModuleModel.name, schema: ModuleSchema },
    ]),
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
