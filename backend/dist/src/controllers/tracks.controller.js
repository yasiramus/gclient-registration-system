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
exports.deleteTrack = exports.updateTrack = exports.getTrackById = exports.getAllTracks = exports.createTrack = void 0;
const sendResponse_1 = require("../lib/sendResponse");
const validateRequest_1 = require("../middleware/validateRequest");
const trackService = __importStar(require("../services/tracks.service"));
const track_schema_1 = require("../schema/track.schema");
/**createTrack */
exports.createTrack = (0, validateRequest_1.parseZod)(track_schema_1.CreateTrackSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = Object.assign(Object.assign({}, req.body), { image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname });
    const track = yield trackService.createTrack(data);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Track created",
        data: track,
        statusCode: 201,
    });
}));
// getAllTracks
const getAllTracks = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tracks = yield trackService.getAllTracks();
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Tracks retrieved successfully",
        data: tracks,
    });
});
exports.getAllTracks = getAllTracks;
//getTracks;
const getTrackById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const track = yield trackService.getTrackById(req.params.id);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Track retrieved",
        data: track,
    });
});
exports.getTrackById = getTrackById;
// updateTrack;
exports.updateTrack = (0, validateRequest_1.parseZod)(track_schema_1.UpdateTrackSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    const data = Object.assign(Object.assign({}, req.body), { image: image ? image : undefined });
    const updatedTrack = yield trackService.updateTrack(req.params.id, data);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Track updated",
        data: updatedTrack,
    });
}));
// deleteTrack;
const deleteTrack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deleted = yield trackService.deleteTrack(id);
    return (0, sendResponse_1.sendResponse)(res, { message: "Track deleted", data: deleted });
});
exports.deleteTrack = deleteTrack;
