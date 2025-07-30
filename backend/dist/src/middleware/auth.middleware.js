"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Middleware to authenticate JWT tokens and authorize user roles.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function to call the next middleware
 */
const authenticate = (req, res, next) => {
    try {
        const jwtSecret = process.env.JWT_SECRET || "";
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return res.status(401).json({ message: "Missing or malformed token" });
        const token = authHeader.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decodedToken;
        next();
    }
    catch (err) {
        console.error("JWT Error:", err.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res
                .status(403)
                .json("Access Denied, You do not have permission to perform this action");
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
