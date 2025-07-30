"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplate = generateTemplate;
const baseTemplate_1 = require("./templates/baseTemplate");
const verificationTemplate_1 = require("./templates/verificationTemplate");
const resetPasswordTemplate_1 = require("./templates/resetPasswordTemplate");
function generateTemplate(type, payload) {
    switch (type) {
        case "VERIFY":
            return (0, baseTemplate_1.baseTemplate)({
                subject: "Verify Your Email",
                content: (0, verificationTemplate_1.verificationTemplate)(payload),
            });
        case "RESET":
            return (0, baseTemplate_1.baseTemplate)({
                subject: "Reset Your Password",
                content: (0, resetPasswordTemplate_1.resetPasswordTemplate)(payload),
            });
        default:
            throw new Error("Unknown mail type");
    }
}
