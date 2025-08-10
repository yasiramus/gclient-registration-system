import { prisma } from "../db/client";

//total income
export const incomePerInvoice = async () => {
  const totalIncome = await prisma.invoice.aggregate({
    _sum: {
      amountPaid: true,
    },
  });
  if (!totalIncome || totalIncome._sum.amountPaid === null)
    throw new Error("No income data available");
  return totalIncome;
};

// /income per track (group track by name )
export const incomePerTrack = async () => {
  const incomePerTrack = await prisma.track.findMany({
    select: {
      id: true,
      name: true,
      learners: {
        select: {
          invoices: {
            select: {
              amountPaid: true,
            },
            // where: {
            //   status: "PAID",
            // },
          },
        },
      },
    },
  });

  if (!incomePerTrack || incomePerTrack.length === 0)
    throw new Error("No income data available for tracks");

  //   get tracks
  const formattedIncome = incomePerTrack.map((track) => {
    // track return the id, name and learners which is an array
    // get learners
    const totalIncome = track.learners.reduce((sum, learner) => {
      //invoice
      const totalInvoiceOfLearner = learner.invoices.reduce(
        (acc, { amountPaid }) => acc + amountPaid,
        0
      );
      return sum + totalInvoiceOfLearner;
    }, 0);

    return {
      id: track.id,
      name: track.name,
      incomePerTrack: totalIncome,
    };
  });
  return formattedIncome;
};
