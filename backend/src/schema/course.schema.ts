import * as z from "zod";

export const createInvoiceSchema = z.object({
  learnerId: z.uuidv4(),
  amountPaid: z.number().min(0),
});

export const coursesSchema = z.object({
  title: z.string().trim().nonempty("title is required"),
  trackId: z.uuid().trim().nonempty("trackId is required"),
  description: z.string().trim(),
  image: z.string().trim().nonempty("image field is required").optional(),
});

export const updateCourseSchema = coursesSchema.partial();
