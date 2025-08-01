import { Request, Response } from "express";
import * as learners from "../services/learners.service";

/**get all learners with filters or not */
export const fetchLearners = async (req: Request, res: Response) => {
  try {
    const { trackId, courseId, paymentStatus } = req.query;

    const learner = await learners.getAllLearners({
      trackId: trackId?.toString(),
      courseId: courseId?.toString(),
      paymentStatus: paymentStatus?.toString() as "FULL" | "PARTIAL",
    });

    res.status(200).json({ success: true, data: learner });
  } catch (error) {
    console.error("Error fetching learners:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch learners." });
  }
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
