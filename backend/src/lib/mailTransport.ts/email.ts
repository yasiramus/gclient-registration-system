import nodemailer from "nodemailer";

import { generateMailOptions } from "./generateMailOptions";
import { IEmailTemplate } from "../../interfaces/email.int";

export const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async ({ to, code, type }: IEmailTemplate) => {
  try {
    const mailOptions = generateMailOptions({ to, code, type });
    const info = await transport.sendMail(mailOptions);
    console.log(`[EMAIL:${type}] sent to ${to} | ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error(
      `[EMAIL:${type}] failed for ${to} | Reason: ${error.message}`
    );
    throw new Error(`Failed to send ${type} email. Please contact support.`);
  }
};
