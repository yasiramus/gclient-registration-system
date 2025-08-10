"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../generated/prisma");
const invoice_controller_1 = require("../controllers/invoice.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const invoiceRoute = (0, express_1.Router)();
invoiceRoute.use(auth_middleware_1.requireAuth);
invoiceRoute.use((0, auth_middleware_1.authorizeRoles)(prisma_1.Role.SUPER_ADMIN || prisma_1.Role.ADMIN));
invoiceRoute.get("/", invoice_controller_1.getAllInvoices);
invoiceRoute.get("/:learnerId", invoice_controller_1.getInvoicesByLearner); // /api/invoices/:learnerId
exports.default = invoiceRoute;
