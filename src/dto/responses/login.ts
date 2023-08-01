import { ObjectId } from "bson";

export interface ILoginResponse {
  token: string;
  user: {
    _id: ObjectId;
    wallet: string;
    email?: string;
    name?: string;
    nickname?: string;
    signature: string;
    verified: boolean;
  };
}
