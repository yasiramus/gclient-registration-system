import { prisma } from "../db/client";

import { LearnerFilters } from "../interfaces/learners.int";

export const createLearner = async (data: any) => {
  return await prisma.learner.create({
    data,
  });
};

/**retrieve learners with optional filters */
export const getAllLearners = async (filters: LearnerFilters) => {
  const { trackId, courseId, paymentStatus } = filters;

  const learners = await prisma.learner.findMany({
    where: {
      ...(trackId && { trackId }),
      ...(courseId && { courseId }),
      ...(paymentStatus && {
        invoices: {
          some: {
            status: paymentStatus,
          },
        },
      }),
    },
    include: {
      enrolledTrack: true,
      enrolledCourse: true,
      invoices: true,
    },
  });

  const filtered = learners
    .map((learner) => {
      if (!learner.invoices.length) return null;

      // Find the latest invoice that matches the status
      const latestMatchingInvoice = learner.invoices
        .filter(({ status }) => status === paymentStatus)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

      if (!latestMatchingInvoice) return null;

      return {
        ...learner,
        invoices: [latestMatchingInvoice],
      };
    })
    .filter(Boolean); // remove nulls

  return paymentStatus ? filtered : learners;
};

/**retrieve a single learner */
export const getLearnerById = async (id: string) => {
  const learner = await prisma.learner.findUnique({
    where: { id },
    include: {
      enrolledTrack: true,
      enrolledCourse: true,
      invoices: true,
    },
  });

  if (!learner) {
    throw new Error("Learner not found");
  }
  return learner;
};
