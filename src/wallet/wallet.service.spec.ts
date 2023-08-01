import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { WalletService } from "./wallet.service";
import { Model } from "mongoose";
import { Wallet } from "../schemas/wallet.schema";
import { ethers } from "ethers";
import { encrypt } from "../utils/crypto";

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
    it("should return an array of wallet documents for the given user ID", async () => {
      const userId = "user123";
      const expectedWallets = [
        { _id: "wallet1", address: "address1", user: userId },
        { _id: "wallet2", address: "address2", user: userId },
      ];
      jest.spyOn(walletModel, "find").mockResolvedValue(expectedWallets);

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
      const privateKey = "privateKey123";
      const address = "address123";
      jest.spyOn(ethers.Wallet, "createRandom").mockReturnValue({
        privateKey,
        address,
      } as any);

      const result = walletService.createRandomWallet();

      expect(result).toEqual({ privateKey, address });
      expect(ethers.Wallet.createRandom).toBeCalledTimes(1);
    });
  });

  describe("saveWalletToUser", () => {
    it("should save a new wallet to the database and return the saved wallet document", async () => {
      const privateKey = "privateKey123";
      const encryptedPrivateKey = encrypt(privateKey);
      const address = "address123";
      const userId = "user123";
      const rpcConfig = { url: "localhost", chainId: 1 };
      const expectedWallet = {
        _id: "wallet123",
        privateKey: encryptedPrivateKey,
        address,
        user: userId,
        rpcConfig,
      };

      jest.spyOn(walletService, "createRandomWallet").mockReturnValue({
        privateKey,
        address,
      });
      jest
        .spyOn(walletModel, "create")
        .mockResolvedValue(expectedWallet as any);

      const result = await walletService.saveWalletToUser(
        privateKey,
        address,
        userId,
        rpcConfig
      );

      expect(result).toEqual(expectedWallet);
      expect(walletModel.create).toBeCalledWith({
        privateKey: encryptedPrivateKey,
        address,
        user: userId,
        rpcConfig,
      });
      expect(walletModel.create).toBeCalledTimes(1);
    });
  });
});
