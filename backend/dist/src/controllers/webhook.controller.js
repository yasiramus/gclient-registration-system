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
exports.handlePaystackWebhook = void 0;
const crypto_1 = require("crypto");
const sendResponse_1 = require("../lib/sendResponse");
const invoice_service_1 = require("../services/invoice.service");
const isValidSignature = (req, secret) => {
    const hash = (0, crypto_1.createHmac)("sha512", secret)
        .update(JSON.stringify(req.body))
        .digest("hex");
    return hash === req.headers["x-paystack-signature"];
};
const handlePaystackWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!isValidSignature(req, process.env.PAYSTACK_SECRET_KEY)) {
        return res.status(403).send("Invalid signature");
    }
    if (req.body === undefined) {
        return res.status(400).send("No data received");
    }
    const { event: eventType, data } = req.body;
    if (eventType !== "charge.success")
        return res.sendStatus(200);
    const learnerId = (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.learnerId;
    const reference = data.reference;
    const amountPaid = data.amount / 100;
    if (!learnerId || !reference)
        return res.status(400).send("Missing required data");
    const invoice = yield (0, invoice_service_1.createInvoice)({ learnerId, amountPaid });
    console.log("Invoice created: ", invoice);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Payment processed successfully",
        data: invoice,
    });
});
exports.handlePaystackWebhook = handlePaystackWebhook;
