import { prisma } from "../db/client";
import { generateOTP } from "../utils/generateOtp";
import { generateExpirationDate } from "./date";

export const generateVerificationToken = async (
  userId: string,
  userType: "admin" | "learner",
  type: "EMAIL" | "RESET"
) => {
  const token = generateOTP(); // OTP code generation
  const expiresAt = generateExpirationDate(0, 5); // 5 minutes from now

  // Build the data object dynamically
  const tokenData: any = {
    token,
    type,
    expiresAt,
  };

  if (userType === "admin") {
    tokenData.adminId = userId;
  } else {
    tokenData.learnerId = userId;
  }

  const newToken = await prisma.verificationToken.create({
    data: tokenData,
  });

  return newToken;
};
