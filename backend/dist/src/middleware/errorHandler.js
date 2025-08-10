"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.log("Error occurred: ", err.message || err);
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: err.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }
    if (err.message === "Track name already exists") {
        return res.status(409).json({
            status: "error",
            message: "Track name already exists",
        });
    }
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
