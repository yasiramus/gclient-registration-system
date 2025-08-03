import { Request, Response } from "express";

import { sendResponse } from "../lib/sendResponse";
import { parseZod } from "../middleware/validateRequest";
import * as trackService from "../services/tracks.service";
import { CreateTrackSchema, UpdateTrackSchema } from "../schema/track.schema";

/**createTrack */
export const createTrack = parseZod(
  CreateTrackSchema,
  async (req: Request, res: Response) => {
    const data = {
      ...req.body,
      image: req.file?.originalname,
    };

    const track = await trackService.createTrack(data);

    return sendResponse(res, {
      message: "Track created",
      data: track,
      statusCode: 201,
    });
  }
);

// getAllTracks
export const getAllTracks = async (_req: Request, res: Response) => {
  const tracks = await trackService.getAllTracks();
  return sendResponse(res, {
    message: "Tracks retrieved successfully",
    data: tracks,
  });
};

//getTracks;
export const getTrackById = async (req: Request, res: Response) => {
  const track = await trackService.getTrackById(req.params.id);
  return sendResponse(res, {
    message: "Track retrieved",
    data: track,
  });
};

// updateTrack;
export const updateTrack = parseZod(
  UpdateTrackSchema,
  async (req: Request, res: Response) => {
    const image = req.file?.filename;

    const data = {
      ...req.body,
      image: image ? image : undefined,
    };
    const updatedTrack = await trackService.updateTrack(req.params.id, data);

    return sendResponse(res, {
      message: "Track updated",
      data: updatedTrack,
    });
  }
);

// deleteTrack;
export const deleteTrack = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await trackService.deleteTrack(id);
  return sendResponse(res, { message: "Track deleted", data: deleted });
};
