import { Router } from "express";

const reportRouter = Router();
import {
  getIncomePerTrack,
  getLearnersPerTrack,
  getTotalIncome,
  getTotalLearners,
} from "../controllers/report.controller";
import { authorizeRoles, requireAuth } from "../middleware/auth.middleware";
import { Role } from "../../generated/prisma";

// Group Protected Routes
reportRouter.use(requireAuth);
reportRouter.use(authorizeRoles(Role.SUPER_ADMIN || Role.ADMIN));

reportRouter.get("/total-learners", getTotalLearners);

reportRouter.get("/total-income", getTotalIncome);
reportRouter.get("/income-per-track", getIncomePerTrack);
reportRouter.get("/learners-per-track", getLearnersPerTrack);

export default reportRouter;
