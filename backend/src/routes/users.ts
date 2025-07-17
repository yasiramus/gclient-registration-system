import { Router } from "express";

import { Role } from "../../generated/prisma";
import { login, registerAdmin } from "../controllers/users";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";

export const authRoute = Router();

authRoute.post("/admin/register", authenticate, authorizeRoles(Role.ADMIN), registerAdmin);

authRoute.post("/login", login)