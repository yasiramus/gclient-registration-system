import { Router } from "express";

import { Role } from "../../generated/prisma";
import { requireAuth, authorizeRoles } from "../middleware/auth.middleware";
import {
  requestPasswordReset,
  resetPassword,
  login,
  registerAdmin,
  verifyEmail,
  resendVerificationCode,
  logout,
} from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post(
  "/admin/register",
  requireAuth,
  authorizeRoles(Role.SUPER_ADMIN),
  registerAdmin
);

authRoute.post("/verify-email", verifyEmail);

authRoute.post("/login", login);
authRoute.post("/logout", logout);

authRoute.get("/request-verification/:email", resendVerificationCode);
authRoute.get("/forgot-password/:email", requestPasswordReset);
authRoute.post("/reset-password/:email", resetPassword);

export default authRoute;
