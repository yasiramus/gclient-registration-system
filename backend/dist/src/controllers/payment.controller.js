"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePayment = void 0;
const client_1 = require("../db/client");
const paystack_1 = require("../lib/paystack");
const validateRequest_1 = require("../middleware/validateRequest");
const invoice_schema_1 = require("../schema/invoice.schema");
/**
 * Initiates a payment transaction using Pay stack.
 * @param req - The request object containing learnerId and amountPaid.
 * @param res - The response object to send the result.
 */
exports.initiatePayment = (0, validateRequest_1.parseZod)(invoice_schema_1.PaymentSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { learnerId, amountPaid } = req.body;
    const learner = yield client_1.prisma.learner.findUnique({
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
    const data = yield (0, paystack_1.initializeTransaction)(transactionData);
    return res.status(200).json(data);
}));
