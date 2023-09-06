import { Module } from "@nestjs/common";
import { UserModuleService } from "./user-module.service";
import { UserModuleController } from "./user-module.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule, UserModuleSchema } from "../schemas/user-module.schema";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModule.name,
        schema: UserModuleSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [UserModuleService],
  controllers: [UserModuleController],
})
export class UserModuleModule {}
