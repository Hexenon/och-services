import { Request } from "express";
import { UserStatus } from "../../schemas/user.schema";

export interface TokenData {
  _id: string;
  email: string;
  status: UserStatus;
}

export type RequestWithTokenData = Request & {
  user: TokenData;
};
