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
exports.getLearnerById = exports.getAllLearners = exports.createLearner = void 0;
const client_1 = require("../db/client");
const hash_1 = require("../lib/hash");
/**learner sign up */
const createLearner = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const existingUser = yield client_1.prisma.learner.findUnique({ where: { email } });
    const hash = yield (0, hash_1.hashPassword)(password);
    if (!hash)
        throw new Error("password can't be hashed");
    if (existingUser)
        throw new Error("Student found login");
    return yield client_1.prisma.learner.create({
        data,
        select: {
            firstName: true,
            lastName: true,
            email: true,
        },
    });
});
exports.createLearner = createLearner;
/**retrieve learners with optional filters */
const getAllLearners = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackId, courseId, paymentStatus } = filters;
    const learners = yield client_1.prisma.learner.findMany({
        where: Object.assign(Object.assign(Object.assign({}, (trackId && { trackId })), (courseId && { courseId })), (paymentStatus && {
            invoices: {
                some: {
                    status: paymentStatus,
                },
            },
        })),
        include: {
            enrolledTrack: true,
            enrolledCourse: true,
            invoices: true,
        },
    });
    const filtered = learners
        .map((learner) => {
        if (!learner.invoices.length)
            return null;
        // Find the latest invoice that matches the status
        const latestMatchingInvoice = learner.invoices
            .filter(({ status }) => status === paymentStatus)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        if (!latestMatchingInvoice)
            return null;
        return Object.assign(Object.assign({}, learner), { invoices: [latestMatchingInvoice] });
    })
        .filter(Boolean); // remove nulls
    return paymentStatus ? filtered : learners;
});
exports.getAllLearners = getAllLearners;
/**retrieve a single learner */
const getLearnerById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const learner = yield client_1.prisma.learner.findUnique({
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
});
exports.getLearnerById = getLearnerById;
