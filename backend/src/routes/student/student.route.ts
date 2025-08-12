// this routes is handle by the student themselves
import { Router } from "express";
import {
  createLearner,
  // getLearnerById,
} from "../../controllers/learners.controller";
// import { requireAuth, authorizeRoles } from "../middleware/auth.middleware";

const studentRouter = Router();

// Group Protected Routes
// studentRouter.use(requireAuth);

//protected route
studentRouter.post("/", createLearner);
// studentRouter.get("/:id", getLearnerById);

export default studentRouter;
