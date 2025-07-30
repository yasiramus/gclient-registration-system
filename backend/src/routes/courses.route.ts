import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  updateCourse,
} from "../controllers/courses.controller";
import { findAllWithFilters } from "../services/courses.service";

const coursesRoute = Router();

// Courses
coursesRoute.post("/", createCourse);
coursesRoute.get("/", findAllWithFilters);
coursesRoute.get("/:id", getCourseById);
coursesRoute.put("/:id", updateCourse);
coursesRoute.delete("/:id", deleteCourse);

export default coursesRoute;
