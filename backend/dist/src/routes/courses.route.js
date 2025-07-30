"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_controller_1 = require("../controllers/courses.controller");
const courses_service_1 = require("../services/courses.service");
const coursesRoute = (0, express_1.Router)();
// Courses
coursesRoute.post("/", courses_controller_1.createCourse);
coursesRoute.get("/", courses_service_1.findAllWithFilters);
coursesRoute.get("/:id", courses_controller_1.getCourseById);
coursesRoute.put("/:id", courses_controller_1.updateCourse);
coursesRoute.delete("/:id", courses_controller_1.deleteCourse);
exports.default = coursesRoute;
