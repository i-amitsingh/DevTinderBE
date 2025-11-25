import type { User } from "./User";

export interface Request {
  _id: string;
  fromUserId: User;
  toUserId?: User | string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
