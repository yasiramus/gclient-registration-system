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
exports.getLearnerById = exports.fetchLearners = exports.createLearner = void 0;
const learners = __importStar(require("../services/learners.service"));
const validateRequest_1 = require("../middleware/validateRequest");
const learner_schema_1 = require("../schema/learner.schema");
const sendResponse_1 = require("../lib/sendResponse");
exports.createLearner = (0, validateRequest_1.parseZod)(learner_schema_1.CreateLearnerSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const learner = yield learners.createLearner(req.body);
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Learner created",
        data: learner,
        statusCode: 201,
    });
}));
/**
 This function retrieves all learners based on optional filters such as trackId, courseId, and paymentStatus.
 IT accepts query parameters and validates them against the `getLearnersQuerySchema`.
 it can also be used without the filters to fetch all learners.
 * *  */
const fetchLearners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queries = Object.assign(Object.assign({}, req.query), { paymentStatus: req.query.paymentStatus
            ? req.query.paymentStatus.toString().toUpperCase()
            : undefined });
    const parseResult = learner_schema_1.getLearnersQuerySchema.parse(queries);
    if (!parseResult) {
        return res.status(400).json({ error: parseResult });
    }
    const { trackId, courseId, paymentStatus } = parseResult;
    const learner = yield learners.getAllLearners({
        trackId,
        courseId,
        paymentStatus,
    });
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Learners fetched",
        data: learner,
    });
});
exports.fetchLearners = fetchLearners;
/**get a specific learner using the id */
const getLearnerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const learner = yield learners.getLearnerById(id);
        res.status(200).json({ learner });
    }
    catch (error) {
        console.error("[GET_LEARNER_BY_ID]", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getLearnerById = getLearnerById;
