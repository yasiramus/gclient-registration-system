import { z } from "zod";
import { PaymentStatus } from "../../generated/prisma";

export const CreateInvoiceSchema = z.object({
  learnerId: z.uuid(),
  amountPaid: z.number().positive(),
  status: z.enum(PaymentStatus),
});

export const UpdateInvoiceSchema = z.object({
  amountPaid: z.number().positive().optional(),
  status: z.enum(PaymentStatus).optional(),
  dueDate: z.coerce.date().optional(),
});

export const PaymentSchema = z.object({
  learnerId: z.uuid().nonempty("Learner ID is required."),
  // amountPaid: z
  //   .number()
  //   .positive()
  //   .nonnegative("Amount paid must be a positive number."),
  amountPaid: z
    .string()
    .trim()
    .nonempty("Amount is required")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "Amount must be a valid number",
    }),
});
