import { baseTemplate } from "./templates/baseTemplate";
import { verificationTemplate } from "./templates/verificationTemplate";
import { resetPasswordTemplate } from "./templates/resetPasswordTemplate";

type MailType = "VERIFY" | "RESET";

export function generateTemplate(type: MailType, payload: string) {
  switch (type) {
    case "VERIFY":
      return baseTemplate({
        subject: "Verify Your Email",
        content: verificationTemplate(payload),
      });
    case "RESET":
      return baseTemplate({
        subject: "Reset Your Password",
        content: resetPasswordTemplate(payload),
      });
    default:
      throw new Error("Unknown mail type");
  }
}
