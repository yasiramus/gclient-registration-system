"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const learners_controller_1 = require("../controllers/learners.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = require("../../generated/prisma");
const learnerRoute = (0, express_1.Router)();
// Group Protected Routes
learnerRoute.use(auth_middleware_1.requireAuth);
learnerRoute.use((0, auth_middleware_1.authorizeRoles)(prisma_1.Role.SUPER_ADMIN || prisma_1.Role.ADMIN));
//protected route
learnerRoute.get("/", learners_controller_1.fetchLearners);
learnerRoute.post("/", learners_controller_1.createLearner);
// learnerRoute.get("/:id", getLearnerById);
exports.default = learnerRoute;
