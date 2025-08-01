import { Role } from "../../generated/prisma";

export interface IUser {
  userType?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified?: boolean;
  role?: Role;
}
