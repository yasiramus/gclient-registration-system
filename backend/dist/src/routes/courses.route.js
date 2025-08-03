"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_controller_1 = require("../controllers/courses.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = require("../../generated/prisma");
const coursesRoute = (0, express_1.Router)();
// /public route
coursesRoute.get("/", courses_controller_1.getAllCourses);
// Group Protected Routes
coursesRoute.use(auth_middleware_1.requireAuth);
coursesRoute.use((0, auth_middleware_1.authorizeRoles)(prisma_1.Role.SUPER_ADMIN || prisma_1.Role.ADMIN));
//protected
coursesRoute.get("/:id", courses_controller_1.getCourseById);
coursesRoute.post("/", courses_controller_1.createCourse);
coursesRoute.put("/:id", courses_controller_1.updateCourse);
coursesRoute.delete("/:id", courses_controller_1.deleteCourse);
exports.default = coursesRoute;
