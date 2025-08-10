import { Role } from "../../generated/prisma";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified?: boolean;
  role?: Role;
}
