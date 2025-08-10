import { z } from "zod";
import { Prisma } from "../../generated/prisma";

export const CreateTrackSchema = z.object({
  price: z
    .string()
    .trim()
    .nonempty("price is required")
    .transform((val) => Prisma.Decimal(val))
    .refine((val) => !val.isNaN(), { message: "Price must be a valid number" }),
  name: z.string().min(4).trim().nonempty("track name is required"),
  duration: z
    .string()
    .trim()
    .nonempty("duration is required")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "Duration must be a valid number",
    }),
  instructor: z.string().trim().nonempty("instructor is required"),
  description: z.string().trim().optional(),
  image: z.string().trim().nonempty("image field is required").optional(),
});

export const UpdateTrackSchema = CreateTrackSchema.partial();
