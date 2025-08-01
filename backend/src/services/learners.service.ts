import { prisma } from "../db/client";

import { LearnerFilters } from "../interfaces/learners.int";

/**retrieve learners with optional filters */
export const getAllLearners = async (filters: LearnerFilters) => {
  const { trackId, courseId, paymentStatus } = filters;

  return await prisma.learner.findMany({
    where: {
      AND: [
        trackId ? { trackId } : {},
        courseId ? { courseId } : {},
        paymentStatus ? { paymentStatus } : {},
      ],
    },
    include: {
      track: true,
      course: true,
      invoices: true,
    },
  });
};

/**retrieve a single learner */
export const getLearnerById = async (id: string) => {
  const learner = await prisma.learner.findUnique({
    where: { id },
    include: {
      track: true,
      course: true,
      invoices: true,
    },
  });

  if (!learner) {
    throw new Error("Learner not found");
  }
  return learner;
};
