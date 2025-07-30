import { Router } from "express";

import { Role } from "../../generated/prisma";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";
import {
  requestPasswordReset,
  resetPassword,
  login,
  registerAdmin,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/users.controller";

const authRoute = Router();

authRoute.post(
  "/admin/register",
  authenticate,
  authorizeRoles(Role.SUPER_ADMIN),
  registerAdmin
);

authRoute.post("/verify-email", verifyEmail);

authRoute.post("/login", login);

authRoute.get("/request-verification/:email", resendVerificationCode);
authRoute.get("/forgot-password/:email", requestPasswordReset);
authRoute.post("/reset-password/:email", resetPassword);

export default authRoute;
