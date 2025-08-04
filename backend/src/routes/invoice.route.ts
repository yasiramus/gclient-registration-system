import { Router } from "express";

import { Role } from "../../generated/prisma";
import {
  createInvoice,
  getAllInvoices,
  getInvoicesByLearner,
} from "../controllers/invoice.controller";
import { authorizeRoles, requireAuth } from "../middleware/auth.middleware";

const invoiceRoute = Router();

invoiceRoute.use(requireAuth);
invoiceRoute.use(authorizeRoles(Role.SUPER_ADMIN || Role.ADMIN));

invoiceRoute.get("/", getAllInvoices);
invoiceRoute.get("/:learnerId", getInvoicesByLearner); // /api/invoices/:learnerId

export default invoiceRoute;
