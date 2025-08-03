import { z } from "zod";
import { Role } from "../../generated/prisma";

export const RegisterSchema = z.object({
  firstName: z.string().min(3).trim().nonempty("first name is required"),
  lastName: z.string().min(3).trim().nonempty("last name is required"),
  email: z.email().trim().nonempty("email is required").toLowerCase(),
  password: z.string().min(10).nonempty("password can't be empty"),
  //   role: z.literal([Role.ADMIN, Role.SUPER_ADMIN]),
});

export const LoginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string(),
});

export const OtpSchema = z.object({
  email: z.email().trim().toLowerCase(),
  code: z.string().length(6).trim(),
});

export const PasswordResetRequestSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const PasswordResetConfirmSchema = z.object({
  email: z.email().trim().toLowerCase(),
  newPassword: z.string().min(6),
});
