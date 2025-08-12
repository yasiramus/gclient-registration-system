"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = exports.resetPassword = exports.requestPasswordReset = exports.requestOTP = exports.verifyOTP = exports.registerAdmin = void 0;
const client_1 = require("../db/client");
const jwt_1 = require("../lib/jwt");
const mailer_1 = require("../lib/mail/mailer");
const token_1 = require("../lib/token");
const prisma_1 = require("../../generated/prisma");
const hash_1 = require("../lib/hash");
/**
 * Register a new user in the system.
 * @param user - The user data to register
 * @returns The newly created user data
 * @throws Error if the user already exists or if there is an error hashing the password
 */
const registerAdmin = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, role } = user;
    const existingUser = yield client_1.prisma.admin.findUnique({ where: { email } });
    //user exit
    if (existingUser) {
        throw new Error("Admin already exists");
    }
    const passwordHash = yield (0, hash_1.hashPassword)(password); //hash password
    if (!passwordHash) {
        throw new Error("Error hashing password");
    }
    //add user to db
    const admin = yield client_1.prisma.admin.create({
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
    const verificationToken = yield (0, token_1.generateVerificationToken)(admin.id, "admin", prisma_1.VerificationType.EMAIL);
    if (!verificationToken) {
        throw new Error("Error generating verification token");
    }
    yield (0, mailer_1.sendMail)({
        to: admin.email,
        type: "VERIFY",
        payload: verificationToken.token,
    });
    return {
        id: admin.id,
        email: admin.email,
        role: admin.role,
    };
});
exports.registerAdmin = registerAdmin;
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
const verifyOTP = (code, email) => __awaiter(void 0, void 0, void 0, function* () {
    // Look up user
    const [admin, learner] = yield client_1.prisma.$transaction([
        client_1.prisma.admin.findUnique({ where: { email } }),
        client_1.prisma.learner.findUnique({ where: { email } }),
    ]);
    const user = admin || learner;
    const isAdmin = !!admin;
    if (!user)
        throw new Error("No account found with this email");
    if (user.isVerified)
        throw new Error("Email has already been verified");
    // Find matching token
    const record = yield client_1.prisma.verificationToken.findFirst({
        where: Object.assign({ token: code }, (isAdmin ? { adminId: user.id } : { learnerId: user.id })),
    });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
        throw new Error("Invalid or expired code");
    }
    // Mark token as used
    yield client_1.prisma.verificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
    });
    // Mark user as verified
    const updatedUser = isAdmin
        ? yield client_1.prisma.admin.update({
            where: { id: user.id },
            data: { isVerified: true },
        })
        : yield client_1.prisma.learner.update({
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
});
exports.verifyOTP = verifyOTP;
/**
 * request verification code using the provided email.
 * @param email - The verification code sent to the user's email
 * @returns A success message if the verification is successful
 * @throws Error if the email is invalid, or already verified
 */
const requestOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [admin, learner] = yield client_1.prisma.$transaction([
        client_1.prisma.admin.findUnique({ where: { email } }),
        client_1.prisma.learner.findUnique({ where: { email } }),
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
    const verificationToken = yield (0, token_1.generateVerificationToken)(userFound.id, isAdmin ? "admin" : "learner", prisma_1.VerificationType.EMAIL);
    if (!verificationToken) {
        throw new Error("Error generating verification token");
    }
    console.log("Verification token created:", verificationToken.token);
    yield (0, mailer_1.sendMail)({
        to: userFound.email,
        payload: verificationToken.token,
        type: "VERIFY",
    });
    return { success: true, message: "Verification code resent successfully" };
});
exports.requestOTP = requestOTP;
/**
 * Request a password reset by generating a verification token and sending an email.
 * @param email - The user's email address
 * @returns A success message if the email is sent
 * @throws Error if the user does not exist or if there is an error generating the token
 */
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const [admin, learner] = yield client_1.prisma.$transaction([
        client_1.prisma.admin.findUnique({ where: { email } }),
        client_1.prisma.learner.findUnique({ where: { email } }),
    ]);
    const userFound = admin || learner;
    if (!userFound) {
        throw new Error("No account found with this email");
    }
    const isAdmin = !!admin;
    // resetToken
    const resetToken = yield (0, token_1.generateVerificationToken)(userFound.id, isAdmin ? "admin" : "learner", prisma_1.VerificationType.RESET);
    if (!resetToken) {
        throw new Error("Error generating reset token");
    }
    console.log("Reset token created:", resetToken.token);
    const password_reset_url = `${process.env.FRONTEND_URL}/verify-email?email=${userFound.email}`;
    yield (0, mailer_1.sendMail)({
        to: userFound.email,
        payload: password_reset_url,
        type: "RESET",
    });
    return {
        success: true,
        message: "Password reset instructions sent to your email",
    };
});
exports.requestPasswordReset = requestPasswordReset;
/**
 * Reset the user's password using the provided user ID and new password.
 * @param userId - The ID of the user
 * @param newPassword - The new password to set
 * @returns A success message if the password is reset successfully
 * @throws Error if the user does not exist or if there is an error hashing the new password
 */
const resetPassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const [admin, learner] = yield client_1.prisma.$transaction([
        client_1.prisma.admin.findUnique({ where: { email } }),
        client_1.prisma.learner.findUnique({ where: { email } }),
    ]);
    const user = admin || learner;
    if (!user) {
        throw new Error("No Account found with this email");
    }
    const match = yield (0, hash_1.compareHashPassword)(newPassword, user.password);
    if (match) {
        throw new Error("Can't use old password");
    }
    // Hash the new password
    const hashedPassword = yield (0, hash_1.hashPassword)(newPassword);
    if (!hashedPassword) {
        throw new Error("Error hashing new password");
    }
    // Update the user's password
    yield client_1.prisma.admin.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });
    return { success: true, message: "Password reset successful" };
});
exports.resetPassword = resetPassword;
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
const logIn = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Query both Admin and Learner in parallel
    const [admin, learner] = yield client_1.prisma.$transaction([
        client_1.prisma.admin.findUnique({ where: { email } }),
        client_1.prisma.learner.findUnique({ where: { email } }),
    ]);
    // If neither exists, invalid credentials
    if (!admin && !learner) {
        throw new Error("Invalid credentials");
    }
    // Determine role & user
    const isAdmin = !!admin;
    const user = admin || learner;
    // Check if account is verified
    if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
        throw new Error(`${isAdmin ? "Admin" : "Learner"} account not verified`);
    }
    // Check password
    const isMatch = yield (0, hash_1.compareHashPassword)(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    // Generate JWT token
    const role = isAdmin ? admin.role : "learner";
    const token = (0, jwt_1.generateToken)(user.id, role);
    // Return payload
    return {
        id: user.id,
        role,
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        token,
    };
});
exports.logIn = logIn;
