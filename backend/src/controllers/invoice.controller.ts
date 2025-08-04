import z from "zod";
import { createInvoiceSchema } from "../schema/course.schema";
import * as invoiceService from "../services/invoice.service";

import { Request, Response } from "express";
import { parseZod } from "../middleware/validateRequest";
import { sendResponse } from "../lib/sendResponse";

/**
 * Creates a new invoice for a learner.
 * Validates the request body against the createInvoiceSchema.
 * manually parses the request body and calls the invoice service to create the invoice.
 */
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

/** Retrieves all invoices with learner details.**/
export const getAllInvoices = async (_req: Request, res: Response) => {
  const invoices = await invoiceService.getAllInvoices();
  return sendResponse(res, {
    message: "Invoices fetched successfully",
    data: invoices,
  });
};

/**
 * Retrieves all invoices for a specific learner by their ID.
 * Validates the learnerId parameter from the request.
 */
export const getInvoicesByLearner = async (req: Request, res: Response) => {
  const { learnerId } = req.params;

  if (!learnerId) {
    return res.status(400).json({ error: "Learner ID is required" });
  }
  const invoices = await invoiceService.getInvoicesByLearner(learnerId);
  return sendResponse(res, {
    message: "Learner invoices fetched",
    data: invoices,
  });
};
