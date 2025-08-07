import { Router } from "express";

const reportRouter = Router();
import {
  getIncomePerTrack,
  getLearnersPerTrack,
  getTotalIncome,
  getTotalLearners,
} from "../controllers/report.controller";

reportRouter.get("/total-learners", getTotalLearners);

reportRouter.get("/total-income", getTotalIncome);
reportRouter.get("/income-per-track", getIncomePerTrack);
reportRouter.get("/learners-per-track", getLearnersPerTrack);

export default reportRouter;
