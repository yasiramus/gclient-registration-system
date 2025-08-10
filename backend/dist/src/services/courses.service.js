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
exports.findAllWithFilters = exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.createCourse = void 0;
const client_1 = require("../db/client");
const createCourse = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const track = yield client_1.prisma.track.findUnique({ where: { id: data.trackId } });
    if (!track)
        throw new Error("Track not found");
    return client_1.prisma.course.create({ data });
});
exports.createCourse = createCourse;
// export const getAllCourses = async () => {
//   return prisma.course.findMany({
//     include: { track: true },
//     orderBy: { createdAt: "desc" },
//   });
// };
const getCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("No id provided");
    const course = yield client_1.prisma.course.findUnique({
        where: { id },
        include: { track: true },
    });
    if (!course)
        throw new Error("Course not found");
    return course;
});
exports.getCourseById = getCourseById;
const updateCourse = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("No id provided");
    const course = yield client_1.prisma.course.findUnique({ where: { id } });
    if (!course)
        throw new Error("Course not found");
    if (!data)
        throw new Error("No data provided");
    // if (data.trackId) {
    const track = yield client_1.prisma.track.findUnique({
        where: { id: data.trackId },
    });
    if (!track)
        throw new Error("Invalid trackId");
    return client_1.prisma.course.update({ where: { id }, data });
});
exports.updateCourse = updateCourse;
const deleteCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("No id provided");
    const course = yield client_1.prisma.course.findUnique({ where: { id } });
    if (!course)
        throw new Error("Course not found");
    const deleted = yield client_1.prisma.course.delete({ where: { id } });
    return `${deleted.title} has been removed from tracks`;
});
exports.deleteCourse = deleteCourse;
/**with filters */
const findAllWithFilters = (_a) => __awaiter(void 0, [_a], void 0, function* ({ trackId, title, page, limit, }) {
    const skip = (page - 1) * limit;
    const where = {};
    if (trackId)
        where.trackId = trackId;
    if (title)
        where.title = { contains: title, mode: "insensitive" };
    const [courses, total] = yield Promise.all([
        client_1.prisma.course.findMany({
            where,
            include: { track: true },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        client_1.prisma.course.count({ where }),
    ]);
    if (!courses)
        throw new Error("No courses found");
    return {
        courses,
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
    };
});
exports.findAllWithFilters = findAllWithFilters;
