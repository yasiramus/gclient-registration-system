import { Request, Response } from "express";
import { adminProfile, updateAdmin } from "../services/admin.service";
import { sendResponse } from "../lib/sendResponse";
import { parseZod } from "../middleware/validateRequest";
import { updateAdminSchema } from "../schema/admin.schema";

export const getAdminInfo = async (req: Request, res: Response) => {
  const { id } = req?.session?.user || "";
  const profile = await adminProfile(id);
  return sendResponse(res, {
    data: profile,
  });
};

export const updateAdminProfile = parseZod(
  updateAdminSchema,
  async (req: Request, res: Response) => {
    const { id } = req?.session?.user || "";
    const profile = await updateAdmin(id, req.body);
    return sendResponse(res, {
      statusCode: 201,
      message: "Admin profile updated",
      data: profile,
    });
  }
);
