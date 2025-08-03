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
    const adminEmail = "admin@gclient.com";
    const existingAdmin = yield client_1.prisma.admin.findUnique({
        where: { email: adminEmail },
    });
    if (existingAdmin) {
        console.log(`✅ Admin user already exists: ${adminEmail}`);
        return;
    }
    if (process.env.NODE_ENV !== "development") {
        throw new Error("Seeding is only allowed in development");
    }
    const hashedPassword = yield (0, hash_1.hashPassword)(process.env.ADMIN_PASSWORD || "Admin@123");
    yield client_1.prisma.admin.create({
        data: {
            firstName: "System",
            lastName: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: prisma_1.Role.SUPER_ADMIN,
            isVerified: true,
        },
    });
    console.log(`🎉 Admin user created: ${adminEmail}`);
    // ✅ Seed Tracks
    const tracks = yield client_1.prisma.track.createMany({
        data: [
            {
                name: "Full Stack Development",
                price: 1000,
                duration: 4, //in weeks
                instructor: "Salaam",
                image: "null",
                description: "Frontend and backend technologies",
            },
            {
                name: "Data Science",
                price: 1000,
                duration: 8,
                instructor: "Moham",
                image: "null",
                description: "Data analysis, ML, and statistics",
            },
            {
                name: "UI/UX Design",
                price: 1000,
                duration: 6,
                instructor: "Dabs",
                image: "null",
                description: "Design principles and tools",
            },
        ],
    });
    // ✅ Get inserted tracks
    const allTracks = yield client_1.prisma.track.findMany();
    // ✅ Seed Courses (linked to tracks)
    for (const track of allTracks) {
        yield client_1.prisma.course.createMany({
            data: [
                {
                    title: `Intro to ${track.name}`,
                    description: `Basic concepts in ${track.name}`,
                    trackId: track.id,
                    image: "",
                },
                {
                    title: `Advanced ${track.name}`,
                    description: `In-depth ${track.name} modules`,
                    image: "",
                    trackId: track.id,
                },
            ],
        });
    }
    console.log("✅ Seed complete.");
});
seedSuperAdmin()
    .catch((e) => {
    console.error("❌ Error seeding admin user:", e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.prisma.$disconnect();
}));
