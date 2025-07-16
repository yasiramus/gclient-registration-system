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
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // const allUsers = await prisma.user.findMany()
        console.log("allUsers: ");
    });
}
main().then(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); })).catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error("connection failed... ", e);
    yield prisma.$disconnect();
    process.exit(1);
}));
