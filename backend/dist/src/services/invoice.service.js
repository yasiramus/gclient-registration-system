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
exports.getInvoicesByLearner = exports.getAllInvoices = exports.createInvoice = void 0;
const client_1 = require("../db/client");
const prisma_1 = require("../../generated/prisma");
const createInvoice = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { learnerId, amountPaid, dueDate } = data;
    const learner = yield client_1.prisma.learner.findUnique({
        where: { id: learnerId },
        include: { enrolledTrack: true, enrolledCourse: true },
    });
    if (!learner || !learner.enrolledTrack || !learner.enrolledCourse)
        throw new Error("Invalid learner");
    // Prevent duplicate invoice
    const existing = yield client_1.prisma.invoice.findFirst({
        where: {
            learnerId,
            AND: {
                status: "PAID",
            },
        },
    });
    console.log("Existing invoice: ", existing);
    if (existing)
        throw new Error("Already processed");
    const coursePrice = Number(learner.enrolledTrack.price);
    let status;
    if (amountPaid >= coursePrice) {
        status = prisma_1.PaymentStatus.PAID;
    }
    else if (amountPaid > 0) {
        status = prisma_1.PaymentStatus.PARTIAL;
    }
    else {
        status = prisma_1.PaymentStatus.PENDING;
    }
    const invoice = yield client_1.prisma.invoice.create({
        data: {
            learnerId,
            amountPaid,
            // dueDate,
            status,
        },
    });
    return invoice;
});
exports.createInvoice = createInvoice;
const getAllInvoices = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all invoices with learner details
    // and order by creation date in descending order
    const invoices = yield client_1.prisma.invoice.findMany({
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
});
exports.getAllInvoices = getAllInvoices;
/**retrieve invoices by learner ID */
const getInvoicesByLearner = (learnerId) => __awaiter(void 0, void 0, void 0, function* () {
    const invoices = yield client_1.prisma.invoice.findMany({
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
});
exports.getInvoicesByLearner = getInvoicesByLearner;
