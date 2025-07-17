import { config } from 'dotenv';
config();

import { prisma } from "./client";

export const dbConnection = async () => {

    console.log("Connecting to prisma postgres...");
    await prisma
        .$connect()
        .then(async () => {
            console.info(`Connected to postgres`);
            await prisma.$disconnect();
        })
        .catch(async (e: any) => {
            console.error("connection failed... ", e)
            await prisma.$disconnect();
            process.exit(1);
        });
};
