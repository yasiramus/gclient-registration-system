import { prisma } from "../db/client";

import { PaymentStatus } from "../../generated/prisma";

export const createInvoice = async (data: {
  learnerId: string;
  amountPaid: number;
  dueDate?: Date;
}) => {
  const { learnerId, amountPaid, dueDate } = data;
  const learner = await prisma.learner.findUnique({
    where: { id: learnerId },
    include: { enrolledTrack: true, enrolledCourse: true },
  });

  if (!learner || !learner.enrolledTrack || !learner.enrolledCourse)
    throw new Error("Invalid learner");

  // Prevent duplicate invoice
  const existing = await prisma.invoice.findFirst({
    where: {
      learnerId,
      createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
    },
  });
  if (existing) throw new Error("Already processed");

  const coursePrice = Number(learner.enrolledTrack.price);
  let status;
  if (amountPaid >= coursePrice) {
    status = PaymentStatus.PAID;
  } else if (amountPaid > 0) {
    status = PaymentStatus.PARTIAL;
  } else {
    status = PaymentStatus.PENDING;
  }

  const invoice = await prisma.invoice.create({
    data: {
      learnerId,
      amountPaid,
      // dueDate,
      status,
    },
  });

  return invoice;
};

export const getAllInvoices = async () => {
  // Fetch all invoices with learner details
  // and order by creation date in descending order

  const invoices = await prisma.invoice.findMany({
    include: {
      learner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!invoices) {
    throw new Error("No invoices found");
  }
  return invoices;
};

/**retrieve invoices by learner ID */
export const getInvoicesByLearner = async (learnerId: string) => {
  const invoices = await prisma.invoice.findMany({
    where: { learnerId },
    include: {
      learner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!invoices || invoices.length === 0) {
    throw new Error("No invoices found for this learner");
  }
  return invoices;
};
