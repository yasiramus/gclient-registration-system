"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = sendResponse;
function sendResponse(res, { status = true, message = "Request successful", data, statusCode = 200, }) {
    return res.status(statusCode).json({
        status,
        message,
        data,
    });
}
