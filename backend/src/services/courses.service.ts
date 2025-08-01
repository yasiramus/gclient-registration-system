import { prisma } from "../db/client";
import { Course } from "../../generated/prisma";
import { CourseFilterOptions } from "../interfaces/course.int";

export const createCourse = async (
  data: Omit<Course, "id" | "createdAt" | "updatedAt">
) => {
  const track = await prisma.track.findUnique({ where: { id: data.trackId } });
  if (!track) throw new Error("Track not found");
  return prisma.course.create({ data });
};

export const getAllCourses = async () => {
  return prisma.course.findMany({
    include: { track: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getCourseById = async (id: string) => {
  if (!id) throw new Error("No id provided");
  const course = await prisma.course.findUnique({
    where: { id },
    include: { track: true },
  });
  if (!course) throw new Error("Course not found");
  return course;
};

export const updateCourse = async (
  id: string,
  data: Omit<Course, "id" | "createdAt" | "updatedAt">
) => {
  if (!id) throw new Error("No id provided");

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error("Course not found");

  if (!data) throw new Error("No data provided");
  // if (data.trackId) {
  const track = await prisma.track.findUnique({
    where: { id: data.trackId },
  });
  if (!track) throw new Error("Invalid trackId");
  // }

  return prisma.course.update({ where: { id }, data });
};

export const deleteCourse = async (id: string) => {
  if (!id) throw new Error("No id provided");
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error("Course not found");

  return prisma.course.delete({ where: { id } });
};

/**with filters */
export const findAllWithFilters = async ({
  trackId,
  title,
  page,
  limit,
}: CourseFilterOptions) => {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (trackId) where.trackId = trackId;
  if (title) where.title = { contains: title, mode: "insensitive" };

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: { track: true },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.count({ where }),
  ]);

  return {
    data: courses,
    page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  };
};
