import { prisma } from "../db/client";

import { PaymentStatus } from "../../generated/prisma";
import e from "express";

/**create invoice for an individual learner */
// export const createInvoices = async (learnerId: string, amountPaid: number,) => {
//   const learner = await prisma.learner.findUnique({
//     where: { id: learnerId },
//     include: { track: true },
//   });

//   if (!learner) throw new Error("Learner not found");

//   const trackPrice: any = learner.track.price;
//   const dueAmount = trackPrice - amountPaid;

//   let status: PaymentStatus;
//   if (dueAmount === 0) return (status = PaymentStatus.PAID);
//   else if (amountPaid > 0 && dueAmount > 0) return PaymentStatus.PARTIAL;
//   else status = PaymentStatus.PENDING;

//   const invoice = await prisma.invoice.create({
//     data: {
//       learnerId,
//       amountPaid,
//       // dueAmount,
//       status,
//     },
//   });

//   //update learner status
//   const learnersPaymentStatus = status;
//   await prisma.learner.update({
//     where: { id: learnerId },
//     data: {
//       // paymentStatus: learnersPaymentStatus,
//     },
//   });

//   return invoice;
// };

export const createInvoice = async (data: {
  learnerId: string;
  amountPaid: number;
  dueDate?: Date;
}) => {
  const { learnerId, amountPaid, dueDate } = data;
  const learner = await prisma.learner.findUnique({
    where: { id: learnerId },
    include: { enrolledTrack: true },
  });

  if (!learner || !learner.enrolledTrack)
    throw new Error("Invalid learner or course");

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
      dueDate,
      status,
    },
  });

  return invoice;
};
