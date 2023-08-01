import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { LinkWalletDTO } from "../dto/validation/link-wallet";
import { AuthGuard } from "../resources/guards/auth.guard";
import { RequestWithTokenData } from "../resources/types/auth";
import { ProfileService } from "./profile.service";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get("/")
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: RequestWithTokenData) {
    return this.profileService.getProfile(req.user._id);
  }

  @UseGuards(AuthGuard)
  @Post("linkWallet")
  async linkWallet(
    @Req() req: RequestWithTokenData,
    @Body() data: LinkWalletDTO
  ): Promise<{ code: string }> {
    return this.profileService.linkWallet(
      req.user._id,
      data.wallet,
      data.signature
    );
  }
}
