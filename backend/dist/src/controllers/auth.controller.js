"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.logout = exports.login = exports.resetPassword = exports.requestPasswordReset = exports.resendVerificationCode = exports.verifyEmail = exports.registerAdmin = void 0;
const prisma_1 = require("../../generated/prisma");
const AuthService = __importStar(require("../services/auth.service"));
const auth_schema_1 = require("../schema/auth.schema");
const validateRequest_1 = require("../middleware/validateRequest");
const sendResponse_1 = require("../lib/sendResponse");
/**
 * Register a new admin user.
 * @param req - Express request object
 * @param res - Express response object
 */
exports.registerAdmin = (0, validateRequest_1.parseZod)(auth_schema_1.RegisterSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = Object.assign(Object.assign({}, req.body), { role: prisma_1.Role.ADMIN });
    const result = yield AuthService.registerAdmin(data);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Admin Registration completed. Check your email to verify.",
        data: result,
        statusCode: 201,
    });
}));
/**
 * Verify the user's email using the provided code and email address.
 * @param req - Express request object
 * @param res - Express response object
 */
exports.verifyEmail = (0, validateRequest_1.parseZod)(auth_schema_1.OtpSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, email } = req.body;
    const result = yield AuthService.verifyOTP(code, email);
    //auto log the user
    if (req.session) {
        req.session.user = { id: result.data.id, role: result.data.role };
    }
    return (0, sendResponse_1.sendResponse)(res, {
        message: result.message,
        data: result.data,
    });
}));
/**resendVerificationCode */
const resendVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = auth_schema_1.PasswordResetRequestSchema.parse(req.params);
    yield AuthService.requestOTP(email);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Verification code sent successfully",
    });
});
exports.resendVerificationCode = resendVerificationCode;
/**requestPasswordReset */
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = auth_schema_1.PasswordResetRequestSchema.parse(req.params);
    console.log;
    const result = yield AuthService.requestPasswordReset(email);
    return (0, sendResponse_1.sendResponse)(res, {
        message: result.message,
    });
});
exports.requestPasswordReset = requestPasswordReset;
/**resetPassword */
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = auth_schema_1.PasswordResetConfirmSchema.parse({
        email: req.params.email,
        newPassword: req.body.newPassword,
    });
    console.log("Resetting password for:", parsed);
    const result = yield AuthService.resetPassword(parsed.email, parsed.newPassword);
    return (0, sendResponse_1.sendResponse)(res, {
        message: result.message,
    });
});
exports.resetPassword = resetPassword;
/**
 * Log in a user and set session.
 * @param req - Express request object
 * @param res - Express response object
 */
exports.login = (0, validateRequest_1.parseZod)(auth_schema_1.LoginSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const saveUser = yield AuthService.logIn(email, password);
    //set session data in cookie
    if (req.session) {
        req.session.user = { id: saveUser.id, role: saveUser.role };
    }
    return (0, sendResponse_1.sendResponse)(res, {
        message: "User logged in successfully",
        data: saveUser,
    });
}));
/**logout clear session */
const logout = (req, res) => {
    req.session = null;
    res.clearCookie("admin_session.sig");
    return res.status(200).json({ message: "Logged out successfully" });
};
exports.logout = logout;
