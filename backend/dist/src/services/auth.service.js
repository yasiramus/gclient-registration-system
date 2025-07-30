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
exports.logIn = exports.changePassword = exports.resetPasswordService = exports.requestPasswordResetService = exports.requestOTPService = exports.verifyOTPService = exports.registerAUser = void 0;
const client_1 = require("../db/client");
const jwt_1 = require("../lib/jwt");
const token_1 = require("../lib/token");
const prisma_1 = require("../../generated/prisma");
const hash_1 = require("../lib/hash");
const mailer_1 = require("../lib/mail/mailer");
/**
 * Register a new user in the system.
 * @param user - The user data to register
 * @returns The newly created user data
 * @throws Error if the user already exists or if there is an error hashing the password
 */
const registerAUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, role } = user;
    const existingUser = yield client_1.prisma.user.findUnique({ where: { email } });
    //user exit
    if (existingUser) {
        throw new Error("User already exists");
    }
    const passwordHash = yield (0, hash_1.hashPassword)(password); //hash password
    if (!passwordHash) {
        throw new Error("Error hashing password");
    }
    //add user to db
    const newUser = yield client_1.prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            passwordHash,
            role: role,
        },
    });
    if (!newUser) {
        throw new Error("Unable to add user");
    }
    // Generate a verification token
    const verificationToken = yield (0, token_1.generateVerificationToken)(newUser.id, prisma_1.VerificationType.EMAIL);
    if (!verificationToken) {
        throw new Error("Error generating verification token");
    }
    yield (0, mailer_1.sendMail)({
        to: newUser.email,
        type: "VERIFY",
        payload: verificationToken.token,
    });
    return {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
    };
});
exports.registerAUser = registerAUser;
/**
 * Verify the user's email using the provided code.
 * @param code - The verification code sent to the user's email
 * @returns A success message if the verification is successful
 * @throws Error if the code is invalid, expired, or already used
 */
const verifyOTPService = (code) => __awaiter(void 0, void 0, void 0, function* () {
    // const userFound = await prisma.user.findUnique({
    //     where: {
    //         email
    //     }
    // });
    // if (!userFound) {
    //     throw new Error("User not found")
    // }
    const record = yield client_1.prisma.verificationToken.findUnique({
        where: {
            token: code,
        },
    });
    if (!record) {
        throw new Error("Invalid or expired verification code");
    }
    if (record.usedAt) {
        throw new Error("Verification code has already been used");
    }
    // Mark the code as used
    yield client_1.prisma.verificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
    });
    // mark user as verified
    yield client_1.prisma.user.update({
        where: { id: record.userId },
        data: { isVerified: true },
    });
    console.log("Email verified for user ID:", record.userId);
    return { success: true, message: "Email verified" };
});
exports.verifyOTPService = verifyOTPService;
/**
 * request verification code using the provided email.
 * @param email - The verification code sent to the user's email
 * @returns A success message if the verification is successful
 * @throws Error if the email is invalid, or already verified
 */
const requestOTPService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userFound = yield client_1.prisma.user.findUnique({ where: { email } });
    if (!userFound) {
        throw new Error("No account found with this email");
    }
    if (userFound.isVerified) {
        throw new Error("Email has already been verified");
    }
    // Generate a verification token
    const verificationToken = yield (0, token_1.generateVerificationToken)(userFound.id, prisma_1.VerificationType.EMAIL);
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
exports.requestOTPService = requestOTPService;
/**
 * Request a password reset by generating a verification token and sending an email.
 * @param email - The user's email address
 * @returns A success message if the email is sent
 * @throws Error if the user does not exist or if there is an error generating the token
 */
const requestPasswordResetService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield client_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("No Account found with this email");
    }
    const resetToken = yield (0, token_1.generateVerificationToken)(user.id, prisma_1.VerificationType.RESET);
    if (!resetToken) {
        throw new Error("Error generating reset token");
    }
    console.log("Reset token created:", resetToken.token);
    const password_reset_url = `${process.env.FRONTEND_URL}/verify-email?email=${user.email}`;
    yield (0, mailer_1.sendMail)({
        to: user.email,
        payload: password_reset_url,
        type: "RESET",
    });
    return {
        success: true,
        message: "Password reset instructions sent to your email",
    };
});
exports.requestPasswordResetService = requestPasswordResetService;
/**
 * Reset the user's password using the provided user ID and new password.
 * @param userId - The ID of the user
 * @param newPassword - The new password to set
 * @returns A success message if the password is reset successfully
 * @throws Error if the user does not exist or if there is an error hashing the new password
 */
const resetPasswordService = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const user = yield client_1.prisma.user.findUnique({ where: { email } });
    console.log("user: ", user);
    if (!user) {
        throw new Error("No Account found with this email");
    }
    const passwordMatch = yield (0, hash_1.compareHashPassword)(newPassword, user.passwordHash);
    if (passwordMatch) {
        throw new Error("Can't use old password");
    }
    // Hash the new password
    const hashedPassword = yield (0, hash_1.hashPassword)(newPassword);
    if (!hashedPassword) {
        throw new Error("Error hashing new password");
    }
    // Update the user's password
    yield client_1.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword },
    });
    return { success: true, message: "Password has been reset successfully" };
});
exports.resetPasswordService = resetPasswordService;
/**
 * Change the user's password after verifying the current password.
 * @param userId - The ID of the user
 * @param currentPassword - The user's current password
 * @param newPassword - The new password to set
 * @returns A success message if the password is changed successfully
 * @throws Error if the current password is incorrect or if there is an error updating the password
 */
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield client_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error("User Not Found");
    }
    const isValid = yield (0, hash_1.compareHashPassword)(currentPassword, user.passwordHash);
    if (!isValid) {
        throw new Error("Current password is incorrect");
    }
    const hashedNewPassword = yield (0, hash_1.hashPassword)(newPassword);
    yield client_1.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashedNewPassword },
    });
    return { success: true, message: "Password changed successfully" };
});
exports.changePassword = changePassword;
/**
 * Log in a user and generate a JWT token.
 * @param user - The user data to log in
 * @returns An object containing the user's ID and JWT token
 * @throws Error if the user does not exist or if the password is incorrect
 */
const logIn = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = user;
    const existingUser = yield client_1.prisma.user.findUnique({ where: { email } });
    if (!existingUser || !existingUser.passwordHash) {
        throw new Error("User does'nt exit or invalid password");
    }
    const isMatch = yield (0, hash_1.compareHashPassword)(password, existingUser.passwordHash);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = (0, jwt_1.generateToken)(existingUser.id, existingUser.role);
    if (!token) {
        throw new Error("Error generating token");
    }
    return {
        id: existingUser.id,
        role: existingUser.role,
        token,
    };
});
exports.logIn = logIn;
