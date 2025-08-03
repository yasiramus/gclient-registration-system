/*
  Warnings:

  - The values [LEARNER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `dueAmount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Learner` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Learner` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `duration` on the `Track` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `adminId` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('ADMIN', 'SUPER_ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."Admin" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Learner" DROP CONSTRAINT "Learner_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VerificationToken" DROP CONSTRAINT "VerificationToken_userId_fkey";

-- DropIndex
DROP INDEX "public"."idx_verification_user_created";

-- AlterTable
ALTER TABLE "public"."Course" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Invoice" DROP COLUMN "dueAmount",
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "public"."Learner" DROP COLUMN "paymentStatus",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "courseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Track" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."VerificationToken" DROP COLUMN "userId",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'ADMIN',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE INDEX "idx_verification_user_created" ON "public"."VerificationToken"("adminId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."Learner" ADD CONSTRAINT "Learner_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VerificationToken" ADD CONSTRAINT "VerificationToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
