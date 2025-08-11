import { Learner } from "../../generated/prisma";
import { prisma } from "../db/client";

import { LearnerFilters } from "../interfaces/learners.int";
import { hashPassword } from "../lib/hash";

/**learner sign up */
export const createLearner = async (
  datas: Omit<Learner, "id" | "createdAt" | "updatedAt">
) => {
  const { email, password } = datas;
  const existingUser = await prisma.learner.findUnique({ where: { email } });
  const hash = await hashPassword(password);
  if (!hash) throw new Error("password can't be hashed");

  const data = { ...datas, password: hash };
  if (existingUser) throw new Error("Email already registered");
  return await prisma.learner.create({
    data,
    select: {
      firstName: true,
      lastName: true,
      email: true,
    },
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
