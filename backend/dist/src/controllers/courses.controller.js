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
const courseService = __importStar(require("../services/courses.service"));
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, trackId } = req.body;
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "Course image is required" });
        }
        const image = req.file.filename;
        const newCourse = yield courseService.createCourse({
            image,
            title,
            trackId,
            description,
        });
        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });
    }
    catch (error) {
        console.error("Create Course Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create course",
        });
    }
});
exports.createCourse = createCourse;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const course = yield courseService.getCourseById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    }
    catch (error) {
        console.error("Error retrieving course:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.getCourseById = getCourseById;
const getAllCoursesNOPagination = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield courseService.getAllCourses();
        res.status(200).json(courses);
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
/**with filters and pagination */
const getAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { trackId, title, page = 1, limit = 10 } = req.query;
        const filters = {
            trackId: trackId ? String(trackId) : undefined,
            title: title ? String(title) : undefined,
            page: Number(page),
            limit: Number(limit),
        };
        const result = yield courseService.findAllWithFilters(filters);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllCourses = getAllCourses;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const data = req.body;
        const updated = yield courseService.updateCourse(id, data);
        if (!updated) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(updated);
    }
    catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield courseService.deleteCourse(id);
        if (!deleted) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteCourse = deleteCourse;
