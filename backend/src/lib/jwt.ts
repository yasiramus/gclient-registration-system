import jwt, { Secret, SignOptions } from "jsonwebtoken";

type AllowedDuration = "1d" | "1h" | "30m" | "15s" | "15m" | "7d";

/**
 * Generates a JWT token with the specified user ID, role, and expiration duration.
 * @param userId - The ID of the user
 * @param role - The role of the user
 * @param expiresIn - Optional expiration duration for the token
 * @returns A signed JWT token
 */

export const generateToken = (
  userId: string | number,
  role: string,
  expiresIn?: AllowedDuration
) => {
  const secret: Secret = process.env.JWT_SECRET || "";

  const allowedDurations: AllowedDuration[] = [
    "1d",
    "1h",
    "30m",
    "15s",
    "15m",
    "7d",
  ];

  const defaultExpiration: AllowedDuration = allowedDurations.includes(
    (process.env.JWT_EXPIRATION as AllowedDuration) || ""
  )
    ? (process.env.JWT_EXPIRATION as AllowedDuration)
    : "1h";

  const duration = expiresIn || defaultExpiration;
  if (!allowedDurations.includes(duration)) {
    throw new Error(
      `Invalid expiration duration: ${duration}. Allowed values: ${allowedDurations.join(
        ", "
      )}`
    );
  }

  const options: SignOptions = {
    expiresIn: duration,
  };
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign({ userId, role }, secret, options);
};
