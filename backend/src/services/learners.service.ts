import { prisma } from "../db/client";

import { LearnerFilters } from "../interfaces/learners.int";

export const createLearner = async (data: any) => {
  return await prisma.learner.create({
    data,
  });
};

/**retrieve learners with optional filters */
export const getAllLearners = async (filters: LearnerFilters) => {
  const { trackId, courseId } = filters;

  return await prisma.learner.findMany({
    where: {
      AND: [
        trackId ? { trackId } : {},
        courseId ? { courseId } : {},
        // paymentStatus ? { paymentStatus } : {},
      ],
    },
    include: {
      enrolledTrack: true,
      enrolledCourse: true,
      invoices: true,
    },
  });
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
