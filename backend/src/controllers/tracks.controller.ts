import { Request, Response } from "express";

import { Prisma } from "../../generated/prisma";
import * as trackService from "../services/tracks.service";

/**createTrack */
export const createTrack = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.json({ body_data: req.body });
    }
    const { name, price, duration, instructor, description } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const image = req.file.filename;

    const newTrack = await trackService.createTrack({
      name,
      price: Prisma.Decimal(price),
      duration,
      instructor,
      description,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Track created successfully",
      data: newTrack,
    });
  } catch (error: any) {
    console.error("Create Track Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create track",
    });
  }
};

// getAllTracks
export const getAllTracks = async (_req: Request, res: Response) => {
  try {
    const tracks = await trackService.getAllTracks();
    return res.status(200).json(tracks);
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Failed to fetch all tracks" });
  }
};

// getTracks;
export const getTracks = async (req: Request, res: Response) => {
  try {
    const track = await trackService.getTrackById(req.params.id);
    if (!track) return res.status(404).json({ error: "Track not found" });
    return res.json(track);
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err.message || "Error retrieving track" });
  }
};

// updateTrack;
export const updateTrack = async (req: Request, res: Response) => {
  try {
    if (!req.body) throw new Error(req.body);
    const { name, price, duration, instructor, description } = req.body;
    const image = req.file?.filename;
    const updatedTrack = await trackService.updateTrack(req.params.id, {
      name,
      price: Prisma.Decimal(price),
      duration,
      instructor,
      description,
      image,
    });

    return res.status(200).json({
      message: "Track updated successfully",
      data: updatedTrack,
    });
  } catch (err: any) {
    console.log("err: ", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to update track" });
  }
};

// deleteTrack;
export const deleteTrack = async (req: Request, res: Response) => {
  try {
    await trackService.deleteTrack(req.params.id);
    return res
      .status(204)
      .json(`${req.params.id} has been deleted successfully`);
  } catch (err: any) {
    console.log("delete_track", err.message);
    return res
      .status(500)
      .json({ error: err.message || "Failed to delete track" });
  }
};
