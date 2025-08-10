"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTrackSchema = exports.CreateTrackSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../generated/prisma");
exports.CreateTrackSchema = zod_1.z.object({
    price: zod_1.z
        .string()
        .trim()
        .nonempty("price is required")
        .transform((val) => prisma_1.Prisma.Decimal(val))
        .refine((val) => !val.isNaN(), { message: "Price must be a valid number" }),
    name: zod_1.z.string().min(4).trim().nonempty("track name is required"),
    duration: zod_1.z
        .string()
        .trim()
        .nonempty("duration is required")
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), {
        message: "Duration must be a valid number",
    }),
    instructor: zod_1.z.string().trim().nonempty("instructor is required"),
    description: zod_1.z.string().trim().optional(),
    image: zod_1.z.string().trim().nonempty("image field is required").optional(),
});
exports.UpdateTrackSchema = exports.CreateTrackSchema.partial();
