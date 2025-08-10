import { prisma } from "./client";
import { hashPassword } from "../lib/hash";
import { Role } from "../../generated/prisma";

const seedSuperAdmin = async () => {
  const adminEmail = "admin@gclient.com";
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`✅ Admin user already exists: ${adminEmail}`);
    return;
  }

  if (process.env.NODE_ENV !== "development") {
    throw new Error("Seeding is only allowed in development");
  }

  const hashedPassword = await hashPassword(
    process.env.ADMIN_PASSWORD || "Admin@123"
  );

  await prisma.admin.create({
    data: {
      firstName: "System",
      lastName: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
    },
  });

  console.log(`🎉 Admin user created: ${adminEmail}`);

  // ✅ Seed Tracks
  const tracks = await prisma.track.createMany({
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
  const allTracks = await prisma.track.findMany();

  // ✅ Seed Courses (linked to tracks)
  for (const track of allTracks) {
    await prisma.course.createMany({
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
};

seedSuperAdmin()
  .catch((e) => {
    console.error("❌ Error seeding admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
