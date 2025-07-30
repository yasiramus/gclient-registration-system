import { Request, Response } from "express";
import * as courseService from "../services/courses.service";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, trackId } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Course image is required" });
    }

    const image = req.file.filename;

    const newCourse = await courseService.createCourse({
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
  } catch (error: any) {
    console.error("Create Course Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create course",
    });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await courseService.getCourseById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error: any) {
    console.error("Error retrieving course:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const getAllCoursesNOPagination = async (_req: Request, res: Response) => {
  try {
    const courses = await courseService.getAllCourses();

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**with filters and pagination */
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { trackId, title, page = 1, limit = 10 } = req.query;

    const filters = {
      trackId: trackId ? String(trackId) : undefined,
      title: title ? String(title) : undefined,
      page: Number(page),
      limit: Number(limit),
    };

    const result = await courseService.findAllWithFilters(filters);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await courseService.updateCourse(id, data);

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await courseService.deleteCourse(id);

    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
