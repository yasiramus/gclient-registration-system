import z from "zod";
import { createInvoiceSchema } from "../schema";
import * as invoiceService from "../services/invoice.service";

import { Request, Response } from "express";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const parsed = createInvoiceSchema.parse(req.body);

    console.log("parsed: ", parsed);
  } catch (error: any) {
    if (error instanceof z.ZodError)
      console.error("create_invoice: ", error.issues);
    return res.status(400).json({ success: false, message: error.issues });
  }
};
