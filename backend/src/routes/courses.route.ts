import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  updateCourse,
} from "../controllers/courses.controller";
import { findAllWithFilters } from "../services/courses.service";
import { authorizeRoles, requireAuth } from "../middleware/auth.middleware";
import { Role } from "../../generated/prisma";

const coursesRoute = Router();
// /public route
coursesRoute.get("/", findAllWithFilters);
coursesRoute.get("/:id", getCourseById);

// Group Protected Routes
coursesRoute.use(requireAuth);
coursesRoute.use(authorizeRoles(Role.SUPER_ADMIN || Role.ADMIN));
//protected
coursesRoute.post("/", createCourse);
coursesRoute.put("/:id", updateCourse);
coursesRoute.delete("/:id", deleteCourse);

export default coursesRoute;
