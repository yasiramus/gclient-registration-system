import * as validation from "zod";
import { Prisma } from "../../generated/prisma";

export const createInvoiceSchema = validation.object({
  learnerId: validation.uuidv4(),
  amountPaid: validation.number().min(0),
});

export const createTrackSchema = validation.object({
  price: validation
    .string()
    .trim()
    .nonempty("price is required")
    .transform((val) => Prisma.Decimal(val))
    .refine((val) => !val.isNaN(), { message: "Price must be a valid number" }),
  name: validation.string().trim().nonempty("track name is required"),
  duration: validation.string().trim().nonempty("duration is required"),
  instructor: validation.string().trim().nonempty("instructor is required"),
  description: validation.string().trim(),
  image: validation.string().trim().nonempty("image field is required"),
});

export const coursesSchema = validation.object({
  title: validation.string().trim().nonempty("title is required"),
  trackId: validation.uuid().trim().nonempty("trackId is required"),
  description: validation.string().trim(),
  image: validation.string().trim().nonempty("image is required"),
});
