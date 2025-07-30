"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordTemplate = resetPasswordTemplate;
function resetPasswordTemplate(resetUrl) {
    return `
    <p>We received a request to reset your password.</p>
    <p>Click the link below to set a new password:</p>
    <p><a href="${resetUrl}" style="color: #3b82f6;">Reset Password</a></p>
    <p>This link will expire in 10 minutes.</p>
  `;
}
