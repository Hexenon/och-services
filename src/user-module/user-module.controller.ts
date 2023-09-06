import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RequestWithTokenData } from "../resources/types/auth";
import { UserModuleService } from "./user-module.service";
import { LocalAuthGuard } from "../resources/guards/auth.guard";
import { ConfigModuleDTO } from "../dto/validation/user-module";
import { UserModuleDocument } from "../schemas/user-module.schema";

@Controller("user-modules")
export class UserModuleController {
  constructor(private readonly userModuleService: UserModuleService) {}
  @UseGuards(LocalAuthGuard)
  @Get("/")
  async getModules(@Req() req: RequestWithTokenData) {
    return this.userModuleService.getModulesByUserId(req.user._id);
  }

  @UseGuards(LocalAuthGuard)
  @Put(":moduleId")
  async configModule(
    @Req() req: RequestWithTokenData,
    @Param("moduleId") moduleId: string,
    @Body() configModuleDto: ConfigModuleDTO
  ): Promise<UserModuleDocument> {
    const { config } = configModuleDto;
    const userId = req.user._id;
    return this.userModuleService.configModuleForUserId(
      userId,
      moduleId,
      config
    );
  }
}
