import { z } from "zod";

export const CreateLearnerSchema = z.object({
  firstName: z.string().min(3).trim().nonempty("first name is required"),
  lastName: z.string().min(3).trim().nonempty("last name is required"),
  email: z.email().trim().nonempty("email is required").toLowerCase(),
  password: z.string().min(10).nonempty("password can't be empty"),
  trackId: z.uuid().optional(),
  courseId: z.uuid().optional(),
});
