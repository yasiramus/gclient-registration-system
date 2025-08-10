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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTransaction = exports.initializeTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const headers = {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
};
const PAYSTACK_BASE = "https://api.paystack.co";
/**
 * Initializes a payment transaction with Paystack.
 * @param {transactionProp} transactionData - The transaction data including email, amount, and optional metadata.
 * @returns {Promise<any>} - The response data from Paystack containing transaction details.
 */
const initializeTransaction = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, amount, metadata, }) {
    const response = yield axios_1.default.post(`${PAYSTACK_BASE}/transaction/initialize`, {
        amount: amount * 100,
        currency: "GHS",
        email,
        metadata,
    }, { headers });
    if (response.status !== 200) {
        throw new Error("Failed to initialize transaction");
    }
    return response.data; // returns authorization_url, reference, etc.
});
exports.initializeTransaction = initializeTransaction;
/**
 * Verifies a payment transaction with Paystack.
 * @param {string} reference - The transaction reference to verify.
 * @returns {Promise<any>} - The response data from Paystack containing verification details.
 */
const verifyTransaction = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${PAYSTACK_BASE}/transaction/verify/${reference}`, { headers });
    console.log("verifyTransaction response: ", response.data);
    return response.data;
});
exports.verifyTransaction = verifyTransaction;
// verifyTransaction("w7nisvz2cd");
