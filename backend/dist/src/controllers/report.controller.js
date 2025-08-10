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
exports.getLearnersPerTrack = exports.getIncomePerTrack = exports.getTotalIncome = exports.getTotalLearners = void 0;
const client_1 = require("../db/client");
const sendResponse_1 = require("../lib/sendResponse");
const report_services_1 = require("../services/report.services");
//Returns the total number of registered learners
const getTotalLearners = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalLearners = yield client_1.prisma.learner
        .count()
        .then((count) => count || 0);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Total registered learners fetched",
        data: totalLearners,
    });
});
exports.getTotalLearners = getTotalLearners;
//total income sum of all invoices
const getTotalIncome = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalIncome = yield (0, report_services_1.incomePerInvoice)();
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Total income fetched",
        data: totalIncome._sum.amountPaid,
    });
});
exports.getTotalIncome = getTotalIncome;
/*  Return income per track
that is how much money has been paid by each learners
in each track.
*/
const getIncomePerTrack = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomeByTrack = yield (0, report_services_1.incomePerTrack)();
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Income per track fetched",
        data: incomeByTrack !== null && incomeByTrack !== void 0 ? incomeByTrack : "inc",
    });
});
exports.getIncomePerTrack = getIncomePerTrack;
// learnersPerTrack;
const getLearnersPerTrack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const learnersPerTrack = yield client_1.prisma.track.findMany({
        select: {
            name: true,
            _count: {
                select: {
                    learners: true,
                },
            },
        },
    });
    const totalRegisteredLearners = learnersPerTrack.reduce((sum, track) => sum + track._count.learners, 0);
    console.log("total learnerRoute: ", totalRegisteredLearners);
    return (0, sendResponse_1.sendResponse)(res, {
        data: { totalRegisteredLearners, learnersPerTrack },
    });
});
exports.getLearnersPerTrack = getLearnersPerTrack;
