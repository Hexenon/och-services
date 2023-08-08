import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { WalletService } from "./wallet.service";
import { Model } from "mongoose";
import { RPCConfig, Wallet } from "../schemas/wallet.schema";
import { ethers } from "ethers";
import { encrypt } from "../utils/crypto";
import { AuthGuard } from "../resources/guards/auth.guard";
import { AuthService } from "../auth/auth.service";
import { User } from "../schemas/user.schema";
import { AuthCodes } from "../schemas/auth-codes";
import { Global, Module } from "@nestjs/common";

describe("WalletService", () => {
  let walletService: WalletService;
  let walletModel: Model<Wallet>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getModelToken(Wallet.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn().mockReturnThis(),
            select: jest.fn().mockResolvedValue([]) as (fields: string) => any,
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    walletService = module.get<WalletService>(WalletService);
    walletModel = module.get<Model<any>>(getModelToken(Wallet.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(walletService).toBeDefined();
  });

  describe("getWalletsByUserId", () => {
    const userId = "user123";
    const expectedWallets = [
      { _id: "wallet1", address: "address1", user: userId },
      { _id: "wallet2", address: "address2", user: userId },
    ];
    it("should return an array of wallet documents for the given user ID", async () => {
      jest.spyOn(walletModel, "find").mockReturnValue({
        select: jest.fn().mockResolvedValue(expectedWallets),
      } as any);

      const result = await walletService.getWalletsByUserId(userId);

      expect(result).toEqual(expectedWallets);
      expect(walletModel.find).toBeCalledWith({ user: userId });
      expect(walletModel.find).toBeCalledTimes(1);
    });
  });

  describe("exportWallet", () => {
    it("should return a wallet document for the given user ID and wallet ID", async () => {
      const userId = "user123";
      const walletId = "wallet123";
      const expectedWallet = {
        _id: walletId,
        address: "address123",
        user: userId,
      };
      jest.spyOn(walletModel, "findOne").mockResolvedValue(expectedWallet);

      const result = await walletService.exportWallet(userId, walletId);

      expect(result).toEqual(expectedWallet);
      expect(walletModel.findOne).toBeCalledWith({
        _id: walletId,
        user: userId,
      });
      expect(walletModel.findOne).toBeCalledTimes(1);
    });

    it("should return null if no wallet is found for the given user ID and wallet ID", async () => {
      const userId = "user123";
      const walletId = "wallet123";
      jest.spyOn(walletModel, "findOne").mockResolvedValue(null);

      const result = await walletService.exportWallet(userId, walletId);

      expect(result).toBeNull();
      expect(walletModel.findOne).toBeCalledWith({
        _id: walletId,
        user: userId,
      });
      expect(walletModel.findOne).toBeCalledTimes(1);
    });
  });
  describe("createRandomWallet", () => {
    it("should return an object containing the private key and address of the new wallet", () => {
      const seed = "seed123";
      const address = "address123";
      jest.spyOn(ethers.Wallet, "createRandom").mockReturnValue({
        address,
        mnemonic: {
          phrase: seed,
        },
      } as any);

      const result = walletService.createRandomWallet();

      expect(result).toEqual({ seed, address });
      expect(ethers.Wallet.createRandom).toBeCalledTimes(1);
    });
  });

  describe("saveWalletToUser", () => {
    it("should save a new wallet to the database and return the saved wallet document", async () => {
      const seed = "seed123";
      const name = "wallet123";
      const address = "address123";
      const userId = "user123";
      const rpcConfig = { url: "localhost", chainId: 1 };
      const expectedWallet = {
        _id: "wallet123",
        seed,
        address,
        user: userId,
        rpcConfig,
      };

      jest.spyOn(walletService, "createRandomWallet").mockReturnValue({
        seed,
        address,
      });
      jest
        .spyOn(walletModel, "create")
        .mockResolvedValue(expectedWallet as any);

      const result = await walletService.saveWalletToUser(
        name,
        seed,
        address,
        userId,
        rpcConfig
      );

      expect(result).toEqual(expectedWallet);
      expect(walletModel.create).toBeCalledWith({
        name,
        seed,
        address,
        user: userId,
        rpcConfig,
      });
      expect(walletModel.create).toBeCalledTimes(1);
    });
  });
});
