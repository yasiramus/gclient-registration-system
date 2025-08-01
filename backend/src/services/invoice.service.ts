import { prisma } from "../db/client";

import { PaymentStatus } from "../../generated/prisma";

/**create invoice for an individual learner */
export const createInvoice = async (learnerId: string, amountPaid: number) => {
  const learner = await prisma.learner.findUnique({
    where: { id: learnerId },
    include: { track: true },
  });

  if (!learner) throw new Error("Learner not found");

  const trackPrice: any = learner.track.price;
  const dueAmount = trackPrice - amountPaid;

  let status: PaymentStatus;
  if (dueAmount === 0) return (status = PaymentStatus.PAID);
  else if (amountPaid > 0 && dueAmount > 0) return PaymentStatus.PARTIAL;
  else status = PaymentStatus.PENDING;

  const invoice = await prisma.invoice.create({
    data: {
      learnerId,
      amountPaid,
      dueAmount,
      status,
    },
  });

  //update learner status
  const learnersPaymentStatus = status;
  await prisma.learner.update({
    where: { id: learnerId },
    data: {
      paymentStatus: learnersPaymentStatus,
    },
  });

  return invoice;
};
