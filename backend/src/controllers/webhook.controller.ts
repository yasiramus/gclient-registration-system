import { Request, Response } from "express";
import { createHmac } from "crypto";

import { sendResponse } from "../lib/sendResponse";
import { createInvoice } from "../services/invoice.service";

const isValidSignature = (req: Request, secret: string): boolean => {
  const hash = createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");
  return hash === req.headers["x-paystack-signature"];
};

export const handlePaystackWebhook = async (req: Request, res: Response) => {
  if (!isValidSignature(req, process.env.PAYSTACK_SECRET_KEY!)) {
    return res.status(403).send("Invalid signature");
  }
  if (req.body === undefined) {
    return res.status(400).send("No data received");
  }
  const { event: eventType, data } = req.body;
  if (eventType !== "charge.success") return res.sendStatus(200);

  const learnerId = data.metadata?.learnerId;
  const reference = data.reference;
  const amountPaid = data.amount / 100;

  if (!learnerId || !reference)
    return res.status(400).send("Missing required data");

  const invoice = await createInvoice({ learnerId, amountPaid });
  console.log("Invoice created: ", invoice);

  return sendResponse(res, {
    message: "Payment processed successfully",
    data: invoice,
  });
};
