"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incomePerTrack = exports.incomePerInvoice = void 0;
const client_1 = require("../db/client");
//total income
const incomePerInvoice = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalIncome = yield client_1.prisma.invoice.aggregate({
        _sum: {
            amountPaid: true,
        },
    });
    if (!totalIncome || totalIncome._sum.amountPaid === null)
        throw new Error("No income data available");
    return totalIncome;
});
exports.incomePerInvoice = incomePerInvoice;
// /income per track (group track by name )
const incomePerTrack = () => __awaiter(void 0, void 0, void 0, function* () {
    const incomePerTrack = yield client_1.prisma.track.findMany({
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
            const totalInvoiceOfLearner = learner.invoices.reduce((acc, { amountPaid }) => acc + amountPaid, 0);
            return sum + totalInvoiceOfLearner;
        }, 0);
        return {
            id: track.id,
            name: track.name,
            incomePerTrack: totalIncome,
        };
    });
    return formattedIncome;
});
exports.incomePerTrack = incomePerTrack;
