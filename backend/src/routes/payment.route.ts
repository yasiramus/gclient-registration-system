import { Router } from "express";
import { initiatePayment } from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/", initiatePayment);

export default paymentRouter;
