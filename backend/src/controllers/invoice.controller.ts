import z from "zod";
import { createInvoiceSchema } from "../schema/course.schema";
import * as invoiceService from "../services/invoice.service";

import { Request, Response } from "express";
import { parseZod } from "../middleware/validateRequest";
import { sendResponse } from "../lib/sendResponse";

export const createInvoice = parseZod(
  createInvoiceSchema,
  async (req: Request, res: Response) => {
    console.log("parsed: ", req.body);

    const invoice = await invoiceService.createInvoice(req.body);
    return sendResponse(res, {
      message: "Invoice created",
      data: invoice,
    });
  }
);
