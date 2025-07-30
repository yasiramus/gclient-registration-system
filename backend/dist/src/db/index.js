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
exports.dbConnection = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const client_1 = require("./client");
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connecting to prisma postgres...");
    yield client_1.prisma
        .$connect()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.info(`Connected to postgres`);
        yield client_1.prisma.$disconnect();
    }))
        .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
        console.error("connection failed... ", e);
        yield client_1.prisma.$disconnect();
        process.exit(1);
    }));
});
exports.dbConnection = dbConnection;
