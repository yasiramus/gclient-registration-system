// import { randomUUID } from "crypto";
import { prisma } from "../db/client";
import { generateOTP } from "../utils/generateOtp";
import { generateExpirationDate } from "./date";

export async function generateVerificationToken(
  userId: string,
  type: "EMAIL" | "RESET"
) {
  const token = generateOTP(); //otp code generation
  const expiresAt = generateExpirationDate(0, 5); // 5 minutes from now
  // const token = randomUUID(); // OTP can also be used here if needed

  const newToken = await prisma.verificationToken.create({
    data: {
      token,
      type,
      userId,
      expiresAt,
    },
  });

  return newToken;
}
