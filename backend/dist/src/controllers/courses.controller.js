"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteCourse = exports.updateCourse = exports.getAllCourses = exports.getCourseById = exports.createCourse = void 0;
const course_schema_1 = require("../schema/course.schema");
const courseService = __importStar(require("../services/courses.service"));
const validateRequest_1 = require("../middleware/validateRequest");
const sendResponse_1 = require("../lib/sendResponse");
exports.createCourse = (0, validateRequest_1.parseZod)(course_schema_1.coursesSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = Object.assign(Object.assign({}, req.body), { image: (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.originalname });
    const course = yield courseService.createCourse(data);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Course created",
        data: course,
        statusCode: 201,
    });
}));
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const course = yield courseService.getCourseById(id);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Course fetched",
        data: course,
    });
});
exports.getCourseById = getCourseById;
// const getAllCoursesNOPagination = async (_req: Request, res: Response) => {
//   try {
//     const courses = await courseService.getAllCourses();
//     res.status(200).json(courses);
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
/**with filters and pagination */
const getAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackId, title, page = 1, limit = 10 } = req.query;
    const filters = {
        trackId: trackId ? String(trackId) : undefined,
        title: title ? String(title) : undefined,
        page: Number(page),
        limit: Number(limit),
    };
    const courses = yield courseService.findAllWithFilters(filters);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Courses fetched",
        data: courses,
    });
});
exports.getAllCourses = getAllCourses;
exports.updateCourse = (0, validateRequest_1.parseZod)(course_schema_1.updateCourseSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    const data = Object.assign(Object.assign({}, req.body), { image: image || undefined });
    const course = yield courseService.updateCourse(id, data);
    res.status(200).json(course);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Course updated",
        data: course,
    });
}));
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield courseService.deleteCourse(id);
    return (0, sendResponse_1.sendResponse)(res, { message: "Course deleted" });
});
exports.deleteCourse = deleteCourse;
