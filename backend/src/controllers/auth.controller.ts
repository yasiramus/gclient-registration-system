import { Request, Response } from "express";

import { Role } from "../../generated/prisma";
import * as AuthService from "../services/auth.service";

import {
  RegisterSchema,
  LoginSchema,
  OtpSchema,
  PasswordResetRequestSchema,
  PasswordResetConfirmSchema,
} from "../schema/auth.schema";

import { parseZod } from "../middleware/validateRequest";
import { sendResponse } from "../lib/sendResponse";

/**
 * Register a new admin user.
 * @param req - Express request object
 * @param res - Express response object
 */
export const registerAdmin = parseZod(
  RegisterSchema,
  async (req: Request, res: Response) => {
    const data = {
      ...req.body,
      role: Role.ADMIN,
    };
    const result = await AuthService.registerAdmin(data);
    return sendResponse(res, {
      message: "Admin Registration completed. Check your email to verify.",
      data: result,
      statusCode: 201,
    });
  }
);

/**
 * Verify the user's email using the provided code and email address.
 * @param req - Express request object
 * @param res - Express response object
 */
export const verifyEmail = parseZod(
  OtpSchema,
  async (req: Request, res: Response) => {
    const { code, email } = req.body;

    const result = await AuthService.verifyOTP(code, email);
    //auto log the user
    if (req.session) {
      req.session.user = { id: result.data.id, role: result.data.role };
    }
    return sendResponse(res, {
      message: result.message,
      data: result.data,
    });
  }
);

/**resendVerificationCode */
export const resendVerificationCode = async (req: Request, res: Response) => {
  const { email } = PasswordResetRequestSchema.parse(req.params);

  await AuthService.requestOTP(email);
  return sendResponse(res, {
    message: "Verification code sent successfully",
  });
};

/**requestPasswordReset */
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = PasswordResetRequestSchema.parse(req.params);
  console.log;
  const result = await AuthService.requestPasswordReset(email);
  return sendResponse(res, {
    message: result.message,
  });
};

/**resetPassword */
export const resetPassword = async (req: Request, res: Response) => {
  const parsed = PasswordResetConfirmSchema.parse({
    email: req.params.email,
    newPassword: req.body.newPassword,
  });

  console.log("Resetting password for:", parsed);
  const result = await AuthService.resetPassword(
    parsed.email,
    parsed.newPassword
  );
  return sendResponse(res, {
    message: result.message,
  });
};

/**
 * Log in a user and set session.
 * @param req - Express request object
 * @param res - Express response object
 */
export const login = parseZod(
  LoginSchema,
  async (req: Request, res: Response) => {
    const saveUser = await AuthService.logIn(req.body);
    //set session data in cookie
    if (req.session) {
      req.session.user = { id: saveUser.id, role: saveUser.role };
    }

    return sendResponse(res, {
      message: "User logged in successfully",
      data: saveUser,
    });
  }
);

/**logout clear session */
export const logout = (req: Request, res: Response) => {
  req.session = null;
  res.clearCookie("admin_session.sig");
  return res.status(200).json({ message: "Logged out successfully" });
};
