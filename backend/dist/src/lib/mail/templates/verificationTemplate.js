"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationTemplate = verificationTemplate;
function verificationTemplate(code) {
    return `
    <p>Thank you for registering.</p>
    <p>Your verification code is:</p>
    <h3>${code}</h3>
    <p>Use this code to verify your account.</p>
  `;
}
