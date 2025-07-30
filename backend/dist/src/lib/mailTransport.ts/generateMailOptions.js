"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMailOptions = generateMailOptions;
function generateMailOptions({ to, code, type, from = process.env.EMAIL_FROM || "G-Client Support", }) {
    // const passworrd_reset_url = `${process.env.FRONTEND_URL}/verify-email?code=${code}`;
    const subject = type === "reset"
        ? "G-Client - Reset Your Password"
        : "G-Client - Verify Your Email";
    const heading = type === "reset"
        ? "Password Reset Request"
        : "Welcome to G-Client Learner Management System!";
    const description = type === "reset"
        ? "We received a request to reset your password. Click the button below to create a new password:"
        : `Thank you for registering. Please verify your email address to complete the registration process.`;
    const buttonText = type === "reset" ? "Reset Password" : "Verify Email Address";
    const fallbackText = type === "reset"
        ? "If you didn't request a password reset, you can safely ignore this email."
        : "If you didn't create an account, you can safely ignore this email.";
    const expiryText = type === "reset"
        ? "<p>This link will expire in 1 hour.</p>"
        : "<p>This Code expires in 10 minutes.</p>";
    return {
        from,
        to,
        subject,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a6cf7;">${heading}</h2>
        <p>${description}</p>
        <p style="font-size: 18px;">Your verification code: <strong>${code}</strong></p>
        <div style="margin: 30px 0;">
          <a href="#" style="background-color: #4a6cf7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">${buttonText}</a>
        </div>
        <p>If the button doesn't work, you can copy and paste the following the code into your browser:</p>
        ${expiryText}
        <p style="margin-top: 30px; font-size: 12px; color: #777;">${fallbackText}</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} gclient. All rights reserved.</p>
        </div>
      </div>
    `,
    };
}
