import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as moment from "moment";
import { AuthCodes, AuthCodesDocument } from "../../schemas/auth-codes";

interface IRegisterLoginCode {
  code: string;
  email: string;
}
@Injectable()
export class LoginCodeService {
  constructor(
    @InjectModel(AuthCodes.name)
    private readonly loginCodesModel: Model<AuthCodesDocument>
  ) {}

  async getCodeInfo(wallet: string, code: string): Promise<AuthCodesDocument> {
    return await this.loginCodesModel.findOne({ wallet, code });
  }

  async createCode(data: IRegisterLoginCode): Promise<AuthCodesDocument> {
    return await this.loginCodesModel.create({
      code: data.code,
      email: data.email,
      used: false,
      expiresIn: moment().add(15, "minutes").toISOString(),
    });
  }

  async updateCode(code: string): Promise<AuthCodesDocument> {
    return await this.loginCodesModel.findOneAndUpdate(
      {
        code,
      },
      { $set: { used: true, updatedAt: Date.now() } },
      { new: true }
    );
  }
}
