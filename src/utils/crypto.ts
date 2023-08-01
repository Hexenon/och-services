import * as crypto from "crypto";
import { config } from "../config";

const password = config.appKey;
const salt = crypto.randomBytes(16);
const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");

/**
 * Encrypts a message using the application key.
 * @param message The message to encrypt.
 * @returns The encrypted message.
 */
export function encrypt(message: string): string {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, salt);
  let encrypted = cipher.update(message);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${salt.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts a message using the application key.
 * @param encryptedMessage The encrypted message.
 * @returns The decrypted message.
 */
export function decrypt(encryptedMessage: string): string {
  const [iv, encrypted] = encryptedMessage
    .split(":")
    .map((hex) => Buffer.from(hex, "hex"));
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
