"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates a JWT token with the specified user ID, role, and expiration duration.
 * @param userId - The ID of the user
 * @param role - The role of the user
 * @param expiresIn - Optional expiration duration for the token
 * @returns A signed JWT token
 */
const generateToken = (userId, role, expiresIn) => {
    const secret = process.env.JWT_SECRET || "";
    const allowedDurations = [
        "1d",
        "1h",
        "30m",
        "15s",
        "15m",
        "7d",
    ];
    const defaultExpiration = allowedDurations.includes(process.env.JWT_EXPIRATION || "")
        ? process.env.JWT_EXPIRATION
        : "1h";
    const duration = expiresIn || defaultExpiration;
    if (!allowedDurations.includes(duration)) {
        throw new Error(`Invalid expiration duration: ${duration}. Allowed values: ${allowedDurations.join(", ")}`);
    }
    const options = {
        expiresIn: duration,
    };
    if (!secret) {
        throw new Error("JWT secret is not defined");
    }
    return jsonwebtoken_1.default.sign({ userId, role }, secret, options);
};
exports.generateToken = generateToken;
