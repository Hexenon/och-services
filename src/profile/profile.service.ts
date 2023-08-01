import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { config } from "../config";
import { verifySignature } from "../resources/utils/wallet";
import { User, UserDocument } from "../schemas/user.schema";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async getProfile(userId: string) {
    return this.userModel
      .find({ _id: userId })
      .select("-password")
      .lean()
      .exec();
  }

  async linkWallet(
    userId: string,
    wallet: string,
    signature: string
  ): Promise<{ code: string }> {
    const isValidSignature = verifySignature(
      wallet,
      config.signMessage,
      signature
    );
    if (!isValidSignature) {
      throw new BadRequestException("INVALID_SIGNATURE");
    }

    const user = await this.userModel
      .findOne({
        userId,
      })
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException("USER_NOT_FOUND");
    }
    const isWalletUsed = await this.userModel
      .findOne({
        wallets: { $elemMatch: { wallet } },
      })
      .lean()
      .exec();
    if (isWalletUsed) {
      throw new BadRequestException("WALLET_ALREADY_USED");
    }

    const update = await this.userModel
      .updateOne(
        {
          userId,
        },
        {
          $push: { wallets: { wallet, signature } },
        }
      )
      .lean()
      .exec();

    if (update.modifiedCount > 0) {
      return { code: "WALLET_LINKED_SUCCESSFULLY" };
    }
  }
}
