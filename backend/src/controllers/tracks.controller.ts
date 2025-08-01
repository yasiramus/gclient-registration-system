import { Request, Response } from "express";

import { Prisma } from "../../generated/prisma";
import * as trackService from "../services/tracks.service";
import { createTrackSchema } from "../schema";
import z from "zod";

/**createTrack */
export const createTrack = async (req: Request, res: Response) => {
  try {
    const data = {
      ...req.body,
      image: req.file?.originalname,
    };

    //validate fields
    const parsed = createTrackSchema.parse(data);

    const newTrack = await trackService.createTrack(parsed);

    return res.status(201).json({
      success: true,
      message: "Track created successfully",
      data: newTrack,
    });
  } catch (error: any) {
    console.error("Create Track Error:", error);

    if (error instanceof z.ZodError) {
      return res.status(500).json({
        success: false,
        message: error.issues[0].message || "Failed to create track",
      });
    }

    return res.status(409).json({ message: "Track name already exists" });
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
    if (!track) return res.status(404).json({ message: "Track not found" });
    return res.json(track);
  } catch (err: any) {
    return res.status(500).json({ message: "Error retrieving track" });
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
      price: Prisma.Decimal(Number(price)),
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
    const { id } = req.params;

    const deleted = await trackService.deleteTrack(id);
    return res.status(200).json({ message: deleted });
  } catch (err: any) {
    console.log("delete_track", err);
    return res.status(500).json({ message: "Failed to delete track" });
  }
};
