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
exports.deleteTrack = exports.updateTrack = exports.getTrackById = exports.getAllTracks = exports.createTrack = void 0;
const client_1 = require("../db/client");
const createTrack = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTrack = yield client_1.prisma.track.findUnique({
        where: {
            name: data.name,
        },
    });
    if (existingTrack)
        throw new Error("Duplicate tack name");
    return yield client_1.prisma.track.create({ data });
});
exports.createTrack = createTrack;
const getAllTracks = () => __awaiter(void 0, void 0, void 0, function* () {
    return ((yield client_1.prisma.track.findMany({
        include: { courses: true },
        orderBy: { createdAt: "desc" },
    })) || []);
});
exports.getAllTracks = getAllTracks;
const getTrackById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("No id provided");
    const findTrack = yield client_1.prisma.track.findUnique({
        where: { id },
        include: { courses: true },
    });
    if (findTrack)
        return findTrack;
    throw new Error("No track found");
});
exports.getTrackById = getTrackById;
const updateTrack = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("No id provided");
    const find_track = yield client_1.prisma.track.findUnique({ where: { id } });
    if (!find_track) {
        throw new Error(" No track was found for an update");
    }
    return yield client_1.prisma.track.update({
        where: { id },
        data,
    });
});
exports.updateTrack = updateTrack;
const deleteTrack = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id)
        throw new Error("No id provided");
    const record = yield client_1.prisma.track.delete({ where: { id } });
    if (!record)
        throw new Error(" No record was found for a delete");
    return record;
});
exports.deleteTrack = deleteTrack;
