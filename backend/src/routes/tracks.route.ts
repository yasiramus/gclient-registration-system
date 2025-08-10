import { Router } from "express";

import { Role } from "../../generated/prisma";

import { authorizeRoles, requireAuth } from "../middleware/auth.middleware";
import {
  createTrack,
  deleteTrack,
  getAllTracks,
  getTrackById,
  updateTrack,
} from "../controllers/tracks.controller";

const trackRoute = Router();

// Group Protected Routes
trackRoute.use(requireAuth);
trackRoute.use(authorizeRoles(Role.SUPER_ADMIN || Role.ADMIN));

//protected routes
trackRoute.get("/:id", getTrackById);
trackRoute.get("/", getAllTracks);
trackRoute.post("/", createTrack);
trackRoute.put("/:id", updateTrack);
trackRoute.delete("/:id", deleteTrack);

export default trackRoute;
