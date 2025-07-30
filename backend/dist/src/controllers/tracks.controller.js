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
exports.deleteTrack = exports.updateTrack = exports.getTracks = exports.getAllTracks = exports.createTrack = void 0;
const prisma_1 = require("../../generated/prisma");
const trackService = __importStar(require("../services/tracks.service"));
/**createTrack */
const createTrack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body) {
            return res.json({ body_data: req.body });
        }
        const { name, price, duration, instructor, description } = req.body;
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "Image file is required" });
        }
        const image = req.file.filename;
        const newTrack = yield trackService.createTrack({
            name,
            price: prisma_1.Prisma.Decimal(price),
            duration,
            instructor,
            description,
            image,
        });
        return res.status(201).json({
            success: true,
            message: "Track created successfully",
            data: newTrack,
        });
    }
    catch (error) {
        console.error("Create Track Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create track",
        });
    }
});
exports.createTrack = createTrack;
// getAllTracks
const getAllTracks = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tracks = yield trackService.getAllTracks();
        return res.status(200).json(tracks);
    }
    catch (err) {
        return res
            .status(500)
            .json({ error: err.message || "Failed to fetch all tracks" });
    }
});
exports.getAllTracks = getAllTracks;
// getTracks;
const getTracks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const track = yield trackService.getTrackById(req.params.id);
        if (!track)
            return res.status(404).json({ error: "Track not found" });
        return res.json(track);
    }
    catch (err) {
        return res
            .status(500)
            .json({ error: err.message || "Error retrieving track" });
    }
});
exports.getTracks = getTracks;
// updateTrack;
const updateTrack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.body)
            throw new Error(req.body);
        const { name, price, duration, instructor, description } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const updatedTrack = yield trackService.updateTrack(req.params.id, {
            name,
            price: prisma_1.Prisma.Decimal(price),
            duration,
            instructor,
            description,
            image,
        });
        return res.status(200).json({
            message: "Track updated successfully",
            data: updatedTrack,
        });
    }
    catch (err) {
        console.log("err: ", err);
        return res
            .status(500)
            .json({ error: err.message || "Failed to update track" });
    }
});
exports.updateTrack = updateTrack;
// deleteTrack;
const deleteTrack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield trackService.deleteTrack(req.params.id);
        return res
            .status(204)
            .json(`${req.params.id} has been deleted successfully`);
    }
    catch (err) {
        console.log("delete_track", err.message);
        return res
            .status(500)
            .json({ error: err.message || "Failed to delete track" });
    }
});
exports.deleteTrack = deleteTrack;
