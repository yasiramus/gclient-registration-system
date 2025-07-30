import nodemailer from "nodemailer";
import { generateTemplate } from "./generateTemplate";

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

type SendMailOptions = {
  to: string;
  type: "VERIFY" | "RESET";
  payload: string; // code or URL
};

export async function sendMail({ to, type, payload }: SendMailOptions) {
  const html = generateTemplate(type, payload);
  return transport.sendMail({
    from: `"G-Client" <${process.env.MAIL_USER}>`,
    to,
    subject: type === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
    html,
  });
}
