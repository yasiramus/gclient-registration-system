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
exports.generateVerificationToken = void 0;
const client_1 = require("../db/client");
const generateOtp_1 = require("../utils/generateOtp");
const date_1 = require("./date");
const generateVerificationToken = (userId, userType, type) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, generateOtp_1.generateOTP)(); // OTP code generation
    const expiresAt = (0, date_1.generateExpirationDate)(0, 5); // 5 minutes from now
    // Build the data object dynamically
    const tokenData = {
        token,
        type,
        expiresAt,
    };
    if (userType === "admin") {
        tokenData.adminId = userId;
    }
    else {
        tokenData.learnerId = userId;
    }
    const newToken = yield client_1.prisma.verificationToken.create({
        data: tokenData,
    });
    return newToken;
});
exports.generateVerificationToken = generateVerificationToken;
