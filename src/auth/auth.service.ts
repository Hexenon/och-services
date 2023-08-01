import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HttpException, NotFoundException } from "@nestjs/common";
import { hashWithAppKey } from "../resources/utils/encryption";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../mail/mail.service";

import { TokenData } from "../resources/types/auth";
import { config } from "../config";
import { User, UserDocument, UserStatus } from "../schemas/user.schema";
import {
  AuthCodes,
  AuthCodesDocument,
  CodeType,
  isCodeValid,
} from "../schemas/auth-codes";

export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(AuthCodes.name)
    private readonly codeModel: Model<AuthCodesDocument>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async loginWithEmail(email: string, password: string): Promise<string> {
    const user = await this.userModel
      .findOne({
        email,
        password: hashWithAppKey(password),
      })
      .select("-password")
      .lean()
      .exec();

    if (!user) {
      throw new HttpException("Invalid credentials", 401);
    }

    if (user.status === UserStatus.UNVERIFIED) {
      throw new HttpException("User is not verified", 401);
    }

    const payload: TokenData = {
      _id: user._id.toString(),
      email: user.email,
      status: user.status,
    };

    const token = await this.jwtService.signAsync(payload);

    return token;
  }

  async register(email: string, password: string): Promise<void> {
    const userExists = await this.userModel.findOne({
      email,
    });
    const mailData = {
      to: email,
      subject:
        config.DevMode || config.StagingMode
          ? "(TEST) OCH - Register verification"
          : "OCH - Register verification",
      template: "verification",
    };

    if (userExists) {
      if (userExists.status === UserStatus.UNVERIFIED) {
        const codeExists = await this.codeModel.findOne({
          email,
          type: CodeType.register,
        });

        let code = "";
        if (codeExists && isCodeValid(codeExists)) {
          code = codeExists.code;
        } else {
          code = await this.generateCode();

          await this.codeModel.updateOne(
            {
              email,
            },
            {
              $set: {
                code,
                createdAt: new Date(),
              },
            }
          );
        }

        await this.mailService.queueMail({
          ...mailData,
          context: { code },
        });

        return;
      }

      throw new HttpException("Email already exists", 400);
    }

    await this.userModel.create({
      email,
      password: hashWithAppKey(password),
    });

    const code = await this.generateCode();
    await this.codeModel.create({
      code,
      email,
    });
    await this.mailService.queueMail({
      ...mailData,
      context: { code },
    });
  }

  async verifyEmail(code: string, email: string): Promise<void> {
    const codeExists = await this.codeModel.findOne({
      code,
      email,
      type: CodeType.register,
    });

    if (!codeExists) {
      throw new HttpException("Invalid code", 400);
    }

    if (!isCodeValid(codeExists)) {
      throw new HttpException("Code expired", 400);
    }

    await this.userModel.updateOne(
      {
        email: codeExists.email,
      },
      {
        $set: {
          status: UserStatus.VERIFIED,
        },
      }
    );

    await this.codeModel.deleteOne({
      code,
    });
  }

  // Blockchain

  async loginWallet(
    wallet: string,
    signature: string
  ): Promise<{ token: string }> {
    const user = await this.userModel
      .findOne({
        wallets: {
          $elemMatch: {
            wallet,
          },
        },
      })
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException("PLAYER_NOT_FOUND");
    }

    const payload: TokenData = {
      _id: user._id.toString(),
      email: user.email,
      status: user.status,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

  async checkEmail(email: string) {
    const user = await this.userModel.findOne({
      email,
    });
    return !!user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return;
    }
    const codeExists = await this.codeModel.findOne({
      email,
      type: CodeType.forgot_password,
    });

    let code = "";
    if (codeExists && isCodeValid(codeExists)) {
      code = codeExists.code;
    } else {
      code = await this.generateCode(CodeType.forgot_password);

      await this.codeModel.updateOne(
        {
          email,
          type: CodeType.forgot_password,
        },
        {
          $set: {
            code,
            createdAt: new Date(),
          },
        },
        {
          upsert: true,
        }
      );
    }

    await this.mailService.queueMail({
      to: email,
      subject: "OCH - Forgot password",
      template: "forgot_password",
      context: { code },
    });

    return;
  }

  async resetPassword(
    code: string,
    email: string,
    password: string
  ): Promise<void> {
    const codeExists = await this.codeModel.findOne({
      code,
      email,
      type: CodeType.forgot_password,
    });

    if (!codeExists) {
      throw new HttpException("Invalid code", 400);
    }

    if (!isCodeValid(codeExists)) {
      throw new HttpException("Code expired", 400);
    }

    await this.userModel.updateOne(
      {
        email,
      },
      {
        $set: {
          password: hashWithAppKey(password),
        },
      }
    );

    await this.codeModel.deleteOne({
      code,
      type: CodeType.forgot_password,
    });
  }

  async generateCode(type = CodeType.register): Promise<string> {
    const code = Math.floor(Math.random() * 1000000).toString();
    const codeExists = await this.codeModel.findOne({
      code,
      type,
    });

    if (codeExists) {
      return await this.generateCode(type);
    }

    return code;
  }

  async validateToken(token: string): Promise<TokenData | undefined> {
    return await this.jwtService.verifyAsync(token, {
      secret: config.appKey,
    });
  }

  async decodeToken(token: string): Promise<TokenData> {
    const decode = this.jwtService.decode(token);
    return JSON.parse(JSON.stringify(decode));
  }
}
