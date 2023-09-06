import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { RequestWithTokenData } from "../resources/types/auth";
import {
  EditWalletDTO,
  GenerateWalletDTO,
  WalletListDTO,
} from "../dto/responses/wallet";
import { LocalAuthGuard } from "../resources/guards/auth.guard";

@Controller("wallet")
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post("/generate")
  @UseGuards(LocalAuthGuard)
  async generateWallet(
    @Req() req: RequestWithTokenData,
    @Body() data: GenerateWalletDTO
  ) {
    const { user } = req;
    const { name } = data;
    const defaultRpcConfig = {
      url: "http://localhost:8545",
      chainId: 1337,
    };
    const { seed, address } = this.walletService.createRandomWallet();
    const wallet = await this.walletService.saveWalletToUser(
      name,
      seed,
      address,
      user._id,
      defaultRpcConfig
    );
    return wallet;
  }

  @Put("/:id")
  @UseGuards(LocalAuthGuard)
  async editWallet(
    @Req() req: RequestWithTokenData,
    @Param("id") id: string,
    @Body() data: EditWalletDTO
  ) {
    const { user } = req;
    const { name, rpcConfig } = data;
    const [wallet] = await this.walletService.getWalletsByUserId(user._id, id);
    if (!wallet) {
      throw new NotFoundException("Wallet not found");
    }
    const updatedWallet = await this.walletService.updateWallet(
      id,
      name,
      rpcConfig
    );
    return updatedWallet;
  }

  @Get("/:id")
  @UseGuards(LocalAuthGuard)
  async findWalletById(
    @Req() req: RequestWithTokenData,
    @Param("id") id: string
  ) {
    const { user } = req;
    const wallet = await this.walletService.getWalletsByUserId(user._id, id);
    if (!wallet) {
      throw new NotFoundException("Wallet not found");
    }
    return wallet;
  }

  @Get("/")
  @UseGuards(LocalAuthGuard)
  async getWallets(@Req() req: RequestWithTokenData): Promise<WalletListDTO[]> {
    const { user } = req;
    const wallets = this.walletService.getWalletsByUserId(user._id);
    return wallets;
  }

  @Get("/export/:id")
  @UseGuards(LocalAuthGuard)
  async exportWallet(
    @Req() req: RequestWithTokenData,
    @Param("id") id: string
  ) {
    const { user } = req;
    return this.walletService.exportWallet(user._id, id);
  }
}
