"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLearnersQuerySchema = exports.CreateLearnerSchema = void 0;
const zod_1 = require("zod");
exports.CreateLearnerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(3).trim().nonempty("first name is required"),
    lastName: zod_1.z.string().min(3).trim().nonempty("last name is required"),
    email: zod_1.z.email().trim().nonempty("email is required").toLowerCase(),
    password: zod_1.z.string().min(10).nonempty("password can't be empty"),
    confirm_password: zod_1.z
        .string()
        .min(10)
        .nonempty("confirm_password can't be empty"),
    trackId: zod_1.z.uuid().optional(),
    courseId: zod_1.z.uuid().optional(),
});
exports.getLearnersQuerySchema = zod_1.z.object({
    trackId: zod_1.z.string().optional(),
    courseId: zod_1.z.string().optional(),
    paymentStatus: zod_1.z.enum(["PAID", "PARTIAL", "PENDING"]).optional(),
});
