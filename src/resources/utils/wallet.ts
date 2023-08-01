import { ethers } from "ethers";

export const verifySignature = (
  wallet: string,
  message: string,
  signature: string
): boolean => {
  try {
    const signatureAddress = ethers.utils.verifyMessage(message, signature);
    return signatureAddress.toLowerCase() === wallet.toLowerCase();
  } catch (e) {
    console.log(`[ERROR VERIFYING SIGNATURE] ${e}`, {
      error: {
        message: e.message,
        stack: e.stack,
      },
      wallet,
    });
    return false;
  }
};
