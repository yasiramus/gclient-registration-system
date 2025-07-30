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
exports.login = exports.resetPassword = exports.requestPasswordReset = exports.resendVerificationCode = exports.verifyEmail = exports.registerAdmin = void 0;
const prisma_1 = require("../../generated/prisma");
const auth_service_1 = require("../services/auth.service");
/**
 * Register a new admin user.
 * @param req - Express request object
 * @param res - Express response object
 */
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = {
            firstName,
            lastName,
            email,
            password,
            role: prisma_1.Role.ADMIN,
        };
        const newUser = yield (0, auth_service_1.registerAUser)(user);
        return res.status(201).json({
            message: "Admin Registration completed. Check your email to verify.",
            data: newUser,
        });
    }
    catch (error) {
        console.error("Error registering admin: ", error.message);
        return res.status(500).json({
            message: error.message || "Internal server error",
        });
    }
});
exports.registerAdmin = registerAdmin;
/**
 * Verify the user's email using the provided code and email address.
 * @param req - Express request object
 * @param res - Express response object
 */
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    try {
        if (!code) {
            return res.status(400).json({ message: "Verification code is required" });
        }
        const result = yield (0, auth_service_1.verifyOTPService)(code);
        return res.status(200).json(result);
    }
    catch ({ message }) {
        console.error("Error verifying user email: ", message);
        return res.status(500).json({
            message: message || "Internal server error",
        });
    }
});
exports.verifyEmail = verifyEmail;
const resendVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const result = yield (0, auth_service_1.requestOTPService)(email);
        return res.status(200).json(result);
    }
    catch ({ message }) {
        console.error("Error sending verification code: ", message);
        return res.status(500).json({
            message: message || "Internal server error",
        });
    }
});
exports.resendVerificationCode = resendVerificationCode;
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const result = yield (0, auth_service_1.requestPasswordResetService)(email);
        return res.status(200).json(result);
    }
    catch ({ message }) {
        console.error("Error requesting password reset: ", message);
        return res.status(500).json({
            message: message || "Internal server error",
        });
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const { newPassword } = req.body;
        const success = yield (0, auth_service_1.resetPasswordService)(email, newPassword);
        return res.status(200).json(success);
    }
    catch (error) {
        console.error("Error resetting password: ", error.message);
        return res.status(500).json({
            message: error.message || "Internal server error",
        });
    }
});
exports.resetPassword = resetPassword;
/**
 * Log in a user and return a JWT token.
 * @param req - Express request object
 * @param res - Express response object
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        const saveUser = yield (0, auth_service_1.logIn)(data);
        res.status(200).json({
            message: "User logged successful",
            data: saveUser,
        });
    }
    catch ({ message }) {
        console.error("Login error:", message);
        res.status(500).json({ message });
    }
});
exports.login = login;
