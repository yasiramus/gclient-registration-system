"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../generated/prisma");
const auth_middleware_1 = require("../middleware/auth.middleware");
const tracks_controller_1 = require("../controllers/tracks.controller");
const trackRoute = (0, express_1.Router)();
// Group Protected Routes
trackRoute.use(auth_middleware_1.requireAuth);
trackRoute.use((0, auth_middleware_1.authorizeRoles)(prisma_1.Role.SUPER_ADMIN || prisma_1.Role.ADMIN));
//protected routes
trackRoute.get("/:id", tracks_controller_1.getTrackById);
trackRoute.get("/", tracks_controller_1.getAllTracks);
trackRoute.post("/", tracks_controller_1.createTrack);
trackRoute.put("/:id", tracks_controller_1.updateTrack);
trackRoute.delete("/:id", tracks_controller_1.deleteTrack);
exports.default = trackRoute;
