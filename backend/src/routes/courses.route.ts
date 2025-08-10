import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/courses.controller";
import { authorizeRoles, requireAuth } from "../middleware/auth.middleware";
import { Role } from "../../generated/prisma";

const coursesRoute = Router();
// /public route
coursesRoute.get("/", getAllCourses);

// Group Protected Routes
coursesRoute.use(requireAuth);
coursesRoute.use(authorizeRoles(Role.SUPER_ADMIN || Role.ADMIN));
//protected
coursesRoute.get("/:id", getCourseById);
coursesRoute.post("/", createCourse);
coursesRoute.put("/:id", updateCourse);
coursesRoute.delete("/:id", deleteCourse);

export default coursesRoute;
