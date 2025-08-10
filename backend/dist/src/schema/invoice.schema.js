"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchema = exports.UpdateInvoiceSchema = exports.CreateInvoiceSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../generated/prisma");
exports.CreateInvoiceSchema = zod_1.z.object({
    learnerId: zod_1.z.uuid(),
    amountPaid: zod_1.z.number().positive(),
    status: zod_1.z.enum(prisma_1.PaymentStatus),
});
exports.UpdateInvoiceSchema = zod_1.z.object({
    amountPaid: zod_1.z.number().positive().optional(),
    status: zod_1.z.enum(prisma_1.PaymentStatus).optional(),
    dueDate: zod_1.z.coerce.date().optional(),
});
exports.PaymentSchema = zod_1.z.object({
    learnerId: zod_1.z.uuid().nonempty("Learner ID is required."),
    // amountPaid: z
    //   .number()
    //   .positive()
    //   .nonnegative("Amount paid must be a positive number."),
    amountPaid: zod_1.z
        .string()
        .trim()
        .nonempty("Amount is required")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), {
        message: "Amount must be a valid number",
    }),
});
