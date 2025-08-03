import { Request, Response } from "express";
import * as learners from "../services/learners.service";
import { parseZod } from "../middleware/validateRequest";
import { CreateLearnerSchema } from "../schema/learner.schema";
import { sendResponse } from "../lib/sendResponse";

export const createLearner = parseZod(
  CreateLearnerSchema,
  async (req: Request, res: Response) => {
    const learner = await learners.createLearner(req.body);
    return sendResponse(res, {
      message: "Learner created",
      data: learner,
      statusCode: 201,
    });
  }
);

/**get all learners with filters or not */
export const fetchLearners = async (req: Request, res: Response) => {
  const { trackId, courseId } = req.query;

  const learner = await learners.getAllLearners({
    trackId: trackId?.toString(),
    courseId: courseId?.toString(),
    // paymentStatus: paymentStatus?.toString() as "FULL" | "PARTIAL",
  });

  return sendResponse(res, {
    message: "Learners fetched",
    data: learner,
  });
};

/**get a specific learner using the id */
export const getLearnerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const learner = await learners.getLearnerById(id);
    res.status(200).json({ learner });
  } catch (error) {
    console.error("[GET_LEARNER_BY_ID]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
