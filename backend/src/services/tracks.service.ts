import { prisma } from "../db/client";
import { Track } from "../../generated/prisma";

export const createTrack = async (
  data: Omit<Track, "id" | "createdAt" | "updatedAt">
) => {
  const existingTrack = await prisma.track.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingTrack) throw new Error("Duplicate tack name");
  return await prisma.track.create({ data });
};

export const getAllTracks = async () => {
  return (
    (await prisma.track.findMany({
      include: { courses: true },
      orderBy: { createdAt: "desc" },
    })) || []
  );
};

export const getTrackById = async (id: string) => {
  if (!id) throw new Error("No id provided");
  const findTrack = await prisma.track.findUnique({
    where: { id },
    include: { courses: true },
  });
  if (findTrack) return findTrack;
  throw new Error("No track found");
};

export const updateTrack = async (id: string, data: Partial<Track>) => {
  if (!id) throw new Error("No id provided");
  const find_track = await prisma.track.findUnique({ where: { id } });

  if (!find_track) {
    throw new Error(" No track was found for an update");
  }
  return await prisma.track.update({
    where: { id },
    data,
  });
};

export const deleteTrack = async (id: string) => {
  if (!id) throw new Error("No id provided");
  const record = await prisma.track.delete({ where: { id } });
  if (!record) throw new Error(" No record was found for a delete");
  return record;
};
