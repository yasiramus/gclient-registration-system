import { Router } from "express";
import { Role } from "../../generated/prisma";
import { initiatePayment } from "../controllers/payment.controller";
import { handlePaystackWebhook } from "../controllers/webhook.controller";
import { authorizeRoles, requireAuth } from "../middleware/auth.middleware";

const paymentRouter = Router();

paymentRouter.use(requireAuth);
paymentRouter.use(authorizeRoles(Role.SUPER_ADMIN || Role.ADMIN));

paymentRouter.post("/", initiatePayment);
paymentRouter.post("/webhook", handlePaystackWebhook);

export default paymentRouter;
