import { Request, Response } from "express";

import { coursesSchema, updateCourseSchema } from "../schema/course.schema";
import * as courseService from "../services/courses.service";
import { parseZod } from "../middleware/validateRequest";
import { sendResponse } from "../lib/sendResponse";

export const createCourse = parseZod(
  coursesSchema,
  async (req: Request, res: Response) => {
    const data = {
      ...req.body,
      image: req?.file?.originalname,
    };
    const course = await courseService.createCourse(data);

    return sendResponse(res, {
      message: "Course created",
      data: course,
      statusCode: 201,
    });
  }
);

export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await courseService.getCourseById(id);
  return sendResponse(res, {
    message: "Course fetched",
    data: course,
  });
};

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
export const getAllCourses = async (req: Request, res: Response) => {
  const { trackId, title, page = 1, limit = 10 } = req.query;

  const filters = {
    trackId: trackId ? String(trackId) : undefined,
    title: title ? String(title) : undefined,
    page: Number(page),
    limit: Number(limit),
  };

  const courses = await courseService.findAllWithFilters(filters);

  return sendResponse(res, {
    message: "Courses fetched",
    data: courses,
  });
};

export const updateCourse = parseZod(
  updateCourseSchema,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const image = req.file?.filename as unknown as string;

    const data = {
      ...req.body,
      image: image || undefined,
    };
    const course = await courseService.updateCourse(id, data);

    res.status(200).json(course);
    return sendResponse(res, {
      message: "Course updated",
      data: course,
    });
  }
);

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  await courseService.deleteCourse(id);
  return sendResponse(res, { message: "Course deleted" });
};
