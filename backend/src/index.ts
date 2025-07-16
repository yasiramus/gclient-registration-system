const {PrismaClient} = require("../generated/prisma");

const prisma = new PrismaClient();

async function main() {
    // const allUsers = await prisma.user.findMany()
    console.log("allUsers: ");
}

main().then(async () => await prisma.$disconnect()).catch(async (e) => {
    console.error("connection failed... ", e)
    await prisma.$disconnect();
    process.exit(1);
})