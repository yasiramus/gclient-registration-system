import { Request, Response } from "express";

import { Role } from "../../generated/prisma";
import { IUser } from "../interfaces/user.int";
import {
  logIn,
  registerAUser,
  requestOTPService,
  requestPasswordResetService,
  resetPasswordService,
  verifyOTPService,
} from "../services/auth.service";

/**
 * Register a new admin user.
 * @param req - Express request object
 * @param res - Express response object
 */
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    //remember to change this to use joi or zod
    // if (Object.keys(req.query).length > 0) {
    //     return res.status(400).json({
    //         message: "The link you used is invalid or contains extra information. Please check and try again."
    //     });
    // }

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user: IUser = {
      firstName,
      lastName,
      email,
      password,
      role: Role.ADMIN,
    };

    const newUser = await registerAUser(user);
    return res.status(201).json({
      message: "Admin Registration completed. Check your email to verify.",
      data: newUser,
    });
  } catch (error: any) {
    console.error("Error registering admin: ", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// export const registerALearner = async (req: Request, res: Response) => {
//   try {
//     const { firstName, lastName, email, password } = req.body;

//     if (!firstName || !lastName || !email || !password) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     const user: IUser = {
//       firstName,
//       lastName,
//       email,
//       password,
//     };

//     const newUser = await registerALearner(user);
//     return res.status(201).json({
//       message: "Successfully enrolled a student. share credentials with them.",
//       data: newUser,
//     });
//   } catch (error: any) {
//     console.error("Error registering enrolling a student: ", error.message);
//     return res.status(500).json({
//       message: error.message || "Internal server error",
//     });
//   }
// };
/**
 * Verify the user's email using the provided code and email address.
 * @param req - Express request object
 * @param res - Express response object
 */
export const verifyEmail = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    if (!code) {
      return res.status(400).json({ message: "Verification code is required" });
    }

    const result = await verifyOTPService(code);
    //auto log the user
    if (req.session) {
      req.session.user = { id: result.data.id, role: result.data.role };
    }
    return res.status(200).json(result);
  } catch ({ message }: any) {
    console.error("Error verifying user email: ", message);
    return res.status(500).json({
      message: message || "Internal server error",
    });
  }
};

/**resendVerificationCode */
export const resendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const result = await requestOTPService(email);
    return res.status(200).json(result);
  } catch ({ message }: any) {
    console.error("Error sending verification code: ", message);
    return res.status(500).json({
      message: message || "Internal server error",
    });
  }
};

/**requestPasswordReset */
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const result = await requestPasswordResetService(email);
    return res.status(200).json(result);
  } catch ({ message }: any) {
    console.error("Error requesting password reset: ", message);
    return res.status(500).json({
      message: message || "Internal server error",
    });
  }
};

/**resetPassword */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { newPassword } = req.body;
    const success = await resetPasswordService(email, newPassword);
    return res.status(200).json(success);
  } catch (error: any) {
    console.error("Error resetting password: ", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

/**
 * Log in a user and set session.
 * @param req - Express request object
 * @param res - Express response object
 */
export const login = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const saveUser = await logIn(data);
    //set session data in cookie
    if (req.session) {
      req.session.user = { id: saveUser.id, role: saveUser.role };
    }
    res.status(200).json({
      message: "User logged successful",
    });
  } catch ({ message }: any) {
    console.error("Login error:", message);
    res.status(500).json({ message });
  }
};

/**logout clear session */
export const logout = (req: Request, res: Response) => {
  req.session = null;
  res.clearCookie("admin_session.sig");
  return res.status(200).json({ message: "Logged out successfully" });
};
