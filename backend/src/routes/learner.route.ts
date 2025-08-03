import { Router } from "express";
import {
  createLearner,
  fetchLearners,
  // getLearnerById,
} from "../controllers/learners.controller";
import { requireAuth, authorizeRoles } from "../middleware/auth.middleware";
import { Role } from "../../generated/prisma";

const learnerRoute = Router();

// Group Protected Routes
learnerRoute.use(requireAuth);
learnerRoute.use(authorizeRoles(Role.SUPER_ADMIN || Role.ADMIN));

//protected route
learnerRoute.get("/", fetchLearners);
learnerRoute.post("/", createLearner);
// learnerRoute.get("/:id", getLearnerById);

export default learnerRoute;
