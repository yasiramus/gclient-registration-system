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
const client_1 = require("./client");
const hash_1 = require("../lib/hash");
const prisma_1 = require("../../generated/prisma");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const adminEmail = 'admin@gclient.com';
    const existingAdmin = yield client_1.prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingAdmin) {
        console.log(`✅ Admin user already exists: ${adminEmail}`);
        return;
    }
    if (process.env.NODE_ENV !== 'development') {
        throw new Error("Seeding is only allowed in development");
    }
    const hashedPassword = yield (0, hash_1.hashPassword)(process.env.ADMIN_PASSWORD || "Admin@123");
    yield client_1.prisma.user.create({
        data: {
            firstName: 'System',
            lastName: 'Admin',
            email: adminEmail,
            passwordHash: hashedPassword,
            role: prisma_1.Role.SUPER_ADMIN,
            isVerified: true,
        },
    });
    console.log(`🎉 Admin user created: ${adminEmail}`);
});
seedSuperAdmin()
    .catch((e) => {
    console.error('❌ Error seeding admin user:', e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.prisma.$disconnect();
}));
