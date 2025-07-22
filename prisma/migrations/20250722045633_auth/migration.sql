/*
  Warnings:

  - You are about to drop the column `token` on the `verification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `verification` table. All the data in the column will be lost.
  - Added the required column `identifier` to the `verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `verification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "verification" DROP CONSTRAINT "verification_userId_fkey";

-- DropIndex
DROP INDEX "verification_userId_idx";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "emailVerified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "verification" DROP COLUMN "token",
DROP COLUMN "userId",
ADD COLUMN     "identifier" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;
