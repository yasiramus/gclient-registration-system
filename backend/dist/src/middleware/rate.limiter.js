"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalRateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.globalRateLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 10, // Limit each IP to 10 requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 60,
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
});
