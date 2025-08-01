import { Router } from "express";

import { Role } from "../../generated/prisma";
import { createInvoice } from "../controllers/invoice.controller";
import { authorizeRoles, requireAuth } from "../middleware/auth.middleware";

const invoiceRoute = Router();

invoiceRoute.use(requireAuth);
invoiceRoute.use(authorizeRoles(Role.SUPER_ADMIN || Role.ADMIN));

invoiceRoute.post("/", createInvoice);

export default invoiceRoute;
