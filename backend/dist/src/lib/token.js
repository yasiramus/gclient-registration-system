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
exports.generateVerificationToken = generateVerificationToken;
// import { randomUUID } from "crypto";
const client_1 = require("../db/client");
const generateOtp_1 = require("../utils/generateOtp");
const date_1 = require("./date");
function generateVerificationToken(userId, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = (0, generateOtp_1.generateOTP)(); //otp code generation
        const expiresAt = (0, date_1.generateExpirationDate)(0, 5); // 5 minutes from now
        // const token = randomUUID(); // OTP can also be used here if needed
        const newToken = yield client_1.prisma.verificationToken.create({
            data: {
                token,
                type,
                userId,
                expiresAt,
            }
        });
        return newToken;
    });
}
