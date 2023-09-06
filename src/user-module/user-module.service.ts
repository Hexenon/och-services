import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ModuleConfig,
  UserModule,
  UserModuleDocument,
} from "../schemas/user-module.schema";

@Injectable()
export class UserModuleService {
  constructor(
    @InjectModel(UserModule.name)
    private readonly userModuleModel: Model<UserModuleDocument>
  ) {}

  async getModulesByUserId(user: string): Promise<UserModuleDocument[]> {
    return this.userModuleModel.find({ user }).populate("module").exec();
  }

  async configModuleForUserId(
    user: string,
    module: string,
    config: ModuleConfig
  ): Promise<UserModuleDocument> {
    const userModule = await this.userModuleModel.findOneAndUpdate(
      { user, module },
      { config },
      { new: true, upsert: true }
    );
    return userModule;
  }
}
