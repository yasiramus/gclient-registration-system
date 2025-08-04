import { Response, Request } from "express";

import { prisma } from "../db/client";
import { initializeTransaction } from "../lib/paystack";
import { parseZod } from "../middleware/validateRequest";
import { PaymentSchema } from "../schema/invoice.schema";
/**
 * Initiates a payment transaction using Paystack.
 * @param req - The request object containing learnerId and amountPaid.
 * @param res - The response object to send the result.
 */
export const initiatePayment = parseZod(
  PaymentSchema,
  async (req: Request, res: Response) => {
    const { learnerId, amountPaid } = req.body;

    const learner = await prisma.learner.findUnique({
      where: { id: learnerId },
    });
    if (!learner)
      return res.status(404).json({ message: "Learner not found." });

    //transaction data
    const transactionData = {
      amount: amountPaid,
      email: learner.email,
      metadata: { learnerId },
    };
    const data = await initializeTransaction(transactionData);
    return res.status(200).json(data);
  }
);
