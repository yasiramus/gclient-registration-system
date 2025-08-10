import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware";
import {
  getAdminInfo,
  updateAdminProfile,
} from "../controllers/admin.controller";

const adminRoute = Router();

adminRoute.use(requireAuth);

adminRoute.get("/", getAdminInfo);
adminRoute.put("/", updateAdminProfile);

export default adminRoute;
