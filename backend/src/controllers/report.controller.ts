import { Request, Response } from "express";
import { prisma } from "../db/client";

import { sendResponse } from "../lib/sendResponse";
import { incomePerInvoice, incomePerTrack } from "../services/report.services";

//Returns the total number of registered learners
export const getTotalLearners = async (_req: Request, res: Response) => {
  const totalLearners: number = await prisma.learner
    .count()
    .then((count) => count || 0);
  return sendResponse(res, {
    message: "Total registered learners fetched",
    data: totalLearners,
  });
};

//total income sum of all invoices
export const getTotalIncome = async (_req: Request, res: Response) => {
  const totalIncome = await incomePerInvoice();
  return sendResponse(res, {
    message: "Total income fetched",
    data: totalIncome._sum.amountPaid,
  });
};

/*  Return income per track
that is how much money has been paid by each learners
in each track.
*/
export const getIncomePerTrack = async (_req: Request, res: Response) => {
  const incomeByTrack = await incomePerTrack();
  return sendResponse(res, {
    message: "Income per track fetched",
    data: incomeByTrack ?? "inc",
  });
};

// learnersPerTrack;
export const getLearnersPerTrack = async (req: Request, res: Response) => {
  const learnersPerTrack = await prisma.track.findMany({
    select: {
      name: true,
      _count: {
        select: {
          learners: true,
        },
      },
    },
  });

  const totalRegisteredLearners = learnersPerTrack.reduce(
    (sum, track) => sum + track._count.learners,
    0
  );

  console.log("total learnerRoute: ", totalRegisteredLearners);

  return sendResponse(res, {
    data: { totalRegisteredLearners, learnersPerTrack },
  });
};
