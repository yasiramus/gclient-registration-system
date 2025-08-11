import { Request, Response } from "express";

import { sendResponse } from "../lib/sendResponse";
import * as learners from "../services/learners.service";
import { parseZod } from "../middleware/validateRequest";
import {
  CreateLearnerSchema,
  getLearnersQuerySchema,
} from "../schema/learner.schema";

/**sign up */
export const createLearner = parseZod(
  CreateLearnerSchema,
  async (req: Request, res: Response) => {
    const data = req.body;
    const { password, confirm_password } = data;

    if (password !== confirm_password)
      return sendResponse(res, {
        status: false,
        message: "password don't match",
        statusCode: 401,
      });

    delete data.confirm_password; //delete confirm password before saving it to the db
    const learner = await learners.createLearner(data);
    return sendResponse(res, {
      message: "Learner created",
      data: learner,
      statusCode: 201,
    });
  }
);

/**
 This function retrieves all learners based on optional filters such as trackId, courseId, and paymentStatus.
 IT accepts query parameters and validates them against the `getLearnersQuerySchema`.
 it can also be used without the filters to fetch all learners.
 * *  */
export const fetchLearners = async (req: Request, res: Response) => {
  const queries = {
    ...req.query,
    paymentStatus: req.query.paymentStatus
      ? req.query.paymentStatus.toString().toUpperCase()
      : undefined,
  };
  const parseResult = getLearnersQuerySchema.parse(queries);
  if (!parseResult) {
    return res.status(400).json({ error: parseResult });
  }

  const { trackId, courseId, paymentStatus } = parseResult;

  const learner = await learners.getAllLearners({
    trackId,
    courseId,
    paymentStatus,
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
