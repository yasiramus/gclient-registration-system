import { Router } from "express";

import { Role } from "../../generated/prisma";

import { authenticate, authorizeRoles } from "../middleware/auth.middleware";
import {
  createTrack,
  deleteTrack,
  getAllTracks,
  getTracks,
  updateTrack,
} from "../controllers/tracks.controller";

const trackRoute = Router();

trackRoute.post(
  "/",
  authenticate,
  authorizeRoles(Role.SUPER_ADMIN || Role.ADMIN),
  createTrack
);

trackRoute.get("/", getAllTracks);
trackRoute.get("/:id", getTracks);
trackRoute.delete("/delete/:id", deleteTrack);
trackRoute.put("/update/:id", updateTrack);

export default trackRoute;
