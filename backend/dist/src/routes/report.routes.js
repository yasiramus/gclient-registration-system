"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportRouter = (0, express_1.Router)();
const report_controller_1 = require("../controllers/report.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const prisma_1 = require("../../generated/prisma");
// Group Protected Routes
reportRouter.use(auth_middleware_1.requireAuth);
reportRouter.use((0, auth_middleware_1.authorizeRoles)(prisma_1.Role.SUPER_ADMIN || prisma_1.Role.ADMIN));
reportRouter.get("/total-learners", report_controller_1.getTotalLearners);
reportRouter.get("/total-income", report_controller_1.getTotalIncome);
reportRouter.get("/income-per-track", report_controller_1.getIncomePerTrack);
reportRouter.get("/learners-per-track", report_controller_1.getLearnersPerTrack);
exports.default = reportRouter;
