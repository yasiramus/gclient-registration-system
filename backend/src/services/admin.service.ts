import { prisma } from "../db/client";
import { Admin } from "../../generated/prisma";

export const adminProfile = async (id: string) => {
  if (!id) throw new Error("No id found");
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!admin) throw new Error("Admin with this account not found");
  return admin;
};

export const updateAdmin = async (id: string, data: Admin) => {
  if (!id) throw new Error("No id found");
  const admin = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (admin?.email === data.email)
    throw new Error("Can't use the same old email");
  const updateProfile = await prisma.admin.update({
    where: { id },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });
  return updateProfile;
};
