import { prisma } from './client';
import { hashPassword } from '../lib/hash';
import { Role } from '../../generated/prisma';

const seedSuperAdmin = async () => {

    const adminEmail = 'admin@gclient.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (existingAdmin) {
        console.log(`✅ Admin user already exists: ${adminEmail}`);
        return;
    }

    if (process.env.NODE_ENV !== 'development') {
        throw new Error("Seeding is only allowed in development");
    }

    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD || "Admin@123");

    await prisma.user.create({
        data: {
            firstName: 'System',
            lastName: 'Admin',
            email: adminEmail,
            passwordHash: hashedPassword,
            role: Role.SUPER_ADMIN,
            isVerified: true,
        },
    });

    console.log(`🎉 Admin user created: ${adminEmail}`);
}

seedSuperAdmin()
    .catch((e) => {
        console.error('❌ Error seeding admin user:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
