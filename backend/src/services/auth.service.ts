import { prisma } from "../db/client";
import { generateToken } from "../lib/jwt";
import { sendMail } from "../lib/mail/mailer";
import { IUser } from "../interfaces/user.int";
import { generateVerificationToken } from "../lib/token";
import { VerificationType } from "../../generated/prisma";
import { compareHashPassword, hashPassword } from "../lib/hash";

/**
 * Register a new user in the system.
 * @param user - The user data to register
 * @returns The newly created user data
 * @throws Error if the user already exists or if there is an error hashing the password
 */
export const registerAdmin = async (user: IUser) => {
  const { firstName, lastName, email, password, role } = user;

  const existingUser = await prisma.admin.findUnique({ where: { email } });

  //user exit
  if (existingUser) {
    throw new Error("Admin already exists");
  }

  const passwordHash = await hashPassword(password); //hash password

  if (!passwordHash) {
    throw new Error("Error hashing password");
  }

  //add user to db
  const admin = await prisma.admin.create({
    data: {
      firstName,
      lastName,
      email,
      password: passwordHash,
      role: role,
      isVerified: false,
    },
  });

  if (!admin) {
    throw new Error("Unable to add an Admin");
  }
  // Generate a verification token
  const verificationToken = await generateVerificationToken(
    admin.id,
    "admin",
    VerificationType.EMAIL
  );

  if (!verificationToken) {
    throw new Error("Error generating verification token");
  }

  await sendMail({
    to: admin.email,
    type: "VERIFY",
    payload: verificationToken.token,
  });

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };
};

/**
 * Verify the user's email using the provided code.
 * @param code - The verification code sent to the user's email
 * @returns A success message if the verification is successful
 * @throws Error if the code is invalid, expired, or already used
 */
// export const verifyOTP = async (code: string, email: string) => {
//   const admin = await prisma.admin.findUnique({ where: { email } });
//   if (!admin) throw new Error("No account found with this email");
//   if (admin.isVerified) {
//     throw new Error("Email has already been verified");
//   }
//   // Check if the verification code exists and is valid
//   const record = await prisma.verificationToken.findUnique({
//     where: {
//       token: code,
//     },
//   });

//   if (!record || record.usedAt) {
//     throw new Error("Invalid or expired code");
//   }

//   // Mark the code as used
//   await prisma.verificationToken.update({
//     where: { id: record.id },
//     data: { usedAt: new Date() },
//   });

//   // mark user as verified
//   const isVerified = await prisma.admin.update({
//     where: { id: record.adminId },
//     data: { isVerified: true },
//   });

//   if (!isVerified) throw new Error("Error verifying user");
//   return {
//     success: true,
//     message: "Email verified",
//     data: { id: isVerified.id, role: isVerified.role },
//   };
// };

export const verifyOTP = async (code: string, email: string) => {
  // Look up user
  const [admin, learner] = await prisma.$transaction([
    prisma.admin.findUnique({ where: { email } }),
    prisma.learner.findUnique({ where: { email } }),
  ]);

  const user = admin || learner;
  const isAdmin = !!admin;

  if (!user) throw new Error("No account found with this email");
  if (user.isVerified) throw new Error("Email has already been verified");

  // Find matching token
  const record = await prisma.verificationToken.findFirst({
    where: {
      token: code,
      ...(isAdmin ? { adminId: user.id } : { learnerId: user.id }),
    },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw new Error("Invalid or expired code");
  }

  // Mark token as used
  await prisma.verificationToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  // Mark user as verified
  const updatedUser = isAdmin
    ? await prisma.admin.update({
        where: { id: user.id },
        data: { isVerified: true },
      })
    : await prisma.learner.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
  const role = isAdmin ? admin.role : "learner";

  return {
    success: true,
    message: "Email verified successfully",
    data: {
      id: updatedUser.id,
      role,
    },
  };
};

/**
 * request verification code using the provided email.
 * @param email - The verification code sent to the user's email
 * @returns A success message if the verification is successful
 * @throws Error if the email is invalid, or already verified
 */
export const requestOTP = async (email: string) => {
  const [admin, learner] = await prisma.$transaction([
    prisma.admin.findUnique({ where: { email } }),
    prisma.learner.findUnique({ where: { email } }),
  ]);
  const userFound = admin || learner;

  if (!userFound) {
    throw new Error("No account found with this email");
  }

  if (userFound.isVerified) {
    throw new Error("Email has already been verified");
  }

  const isAdmin = !!admin;

  // Generate a verification token
  const verificationToken = await generateVerificationToken(
    userFound.id,
    isAdmin ? "admin" : "learner",
    VerificationType.EMAIL
  );

  if (!verificationToken) {
    throw new Error("Error generating verification token");
  }
  console.log("Verification token created:", verificationToken.token);

  await sendMail({
    to: userFound.email,
    payload: verificationToken.token,
    type: "VERIFY",
  });

  return { success: true, message: "Verification code resent successfully" };
};

/**
 * Request a password reset by generating a verification token and sending an email.
 * @param email - The user's email address
 * @returns A success message if the email is sent
 * @throws Error if the user does not exist or if there is an error generating the token
 */
export const requestPasswordReset = async (email: string) => {
  // Check if user exists
  const [admin, learner] = await prisma.$transaction([
    prisma.admin.findUnique({ where: { email } }),
    prisma.learner.findUnique({ where: { email } }),
  ]);
  const userFound = admin || learner;

  if (!userFound) {
    throw new Error("No account found with this email");
  }

  const isAdmin = !!admin;

  // resetToken
  const resetToken = await generateVerificationToken(
    userFound.id,
    isAdmin ? "admin" : "learner",
    VerificationType.RESET
  );

  if (!resetToken) {
    throw new Error("Error generating reset token");
  }
  console.log("Reset token created:", resetToken.token);
  const password_reset_url = `${process.env.FRONTEND_URL}/verify-email?email=${userFound.email}`;

  await sendMail({
    to: userFound.email,
    payload: password_reset_url,
    type: "RESET",
  });

  return {
    success: true,
    message: "Password reset instructions sent to your email",
  };
};

/**
 * Reset the user's password using the provided user ID and new password.
 * @param userId - The ID of the user
 * @param newPassword - The new password to set
 * @returns A success message if the password is reset successfully
 * @throws Error if the user does not exist or if there is an error hashing the new password
 */
export const resetPassword = async (email: string, newPassword: string) => {
  // Check if user exists
  const [admin, learner] = await prisma.$transaction([
    prisma.admin.findUnique({ where: { email } }),
    prisma.learner.findUnique({ where: { email } }),
  ]);

  const user = admin || learner;

  if (!user) {
    throw new Error("No Account found with this email");
  }

  const match = await compareHashPassword(newPassword, user.password);
  if (match) {
    throw new Error("Can't use old password");
  }

  // Hash the new password
  const hashedPassword = await hashPassword(newPassword);
  if (!hashedPassword) {
    throw new Error("Error hashing new password");
  }

  // Update the user's password
  await prisma.admin.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true, message: "Password reset successful" };
};

/**
 * Log in a user and generate a JWT token.
 * @param user - The user data to log in
 * @returns An object containing the user's ID and JWT token
 * @throws Error if the user does not exist or if the password is incorrect
 */
// export const logIn = async (role: string, user: IUser) => {
//   const { email, password } = user;
//   let isAdmin;
//   if (role === "admin") {
//     isAdmin = await prisma.admin.findUnique({ where: { email } });
//     if (!isAdmin || !isAdmin.isVerified) {
//       throw new Error("Invalid credentials");
//     }
//   }

//   const adminPassword = isAdmin?.password as string;

//   let isLearner;
//   if (role === "learner") {
//     isLearner = await prisma.learner.findUnique({ where: { email } });
//     if (!isLearner) {
//       throw new Error("Invalid credentials");
//     }
//   }
//   const learnerPassword = isLearner?.password as string;

//   const match = await compareHashPassword(
//     password,
//     adminPassword || learnerPassword
//   );
//   if (!match) {
//     throw new Error("Invalid password credentials");
//   }

//   // NOTE: Reserved generateToken for email verification, password reset, or public API auth
//   const token = generateToken(isAdmin?.id as string, isAdmin?.role as string);
//   return {
//     id: isAdmin?.id || isLearner?.id,
//     role: isAdmin?.role,
//     email: isAdmin?.email || isLearner?.email,
//     fullName: `${isAdmin?.firstName || isLearner?.firstName} ${
//       isAdmin?.lastName || isLearner?.lastName
//     }`,
//     token,
//   };
// };

export const logIn = async (email: string, password: string) => {
  // Query both Admin and Learner in parallel
  const [admin, learner] = await prisma.$transaction([
    prisma.admin.findUnique({ where: { email } }),
    prisma.learner.findUnique({ where: { email } }),
  ]);

  // If neither exists, invalid credentials
  if (!admin && !learner) {
    throw new Error("Invalid credentials");
  }

  // Determine role & user
  const isAdmin = !!admin;
  const user = admin || learner;

  // Check if account is verified
  if (!user?.isVerified) {
    throw new Error(`${isAdmin ? "Admin" : "Learner"} account not verified`);
  }

  // Check password
  const isMatch = await compareHashPassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const role = isAdmin ? admin.role : "learner";
  const token = generateToken(user.id, role);

  // Return payload
  return {
    id: user.id,
    role,
    email: user.email,
    fullName: `${user.firstName} ${user.lastName}`,
    token,
  };
};
