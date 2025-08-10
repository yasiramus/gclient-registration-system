"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetConfirmSchema = exports.PasswordResetRequestSchema = exports.OtpSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(3).trim().nonempty("first name is required"),
    lastName: zod_1.z.string().min(3).trim().nonempty("last name is required"),
    email: zod_1.z.email().trim().nonempty("email is required").toLowerCase(),
    password: zod_1.z.string().min(10).nonempty("password can't be empty"),
    //   role: z.literal([Role.ADMIN, Role.SUPER_ADMIN]),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
    password: zod_1.z.string(),
});
exports.OtpSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
    code: zod_1.z.string().length(6).trim(),
});
exports.PasswordResetRequestSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
});
exports.PasswordResetConfirmSchema = zod_1.z.object({
    email: zod_1.z.email().trim().toLowerCase(),
    newPassword: zod_1.z.string().min(6),
});
