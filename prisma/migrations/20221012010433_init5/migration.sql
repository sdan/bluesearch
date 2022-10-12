/*
  Warnings:

  - You are about to drop the column `providerAccountId` on the `Tweet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Tweet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,userId]` on the table `Tweet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `author` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_userId_fkey";

-- DropIndex
DROP INDEX "Tweet_id_key";

-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "providerAccountId",
ADD COLUMN     "author" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_userId_key" ON "Tweet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_id_userId_key" ON "Tweet"("id", "userId");

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Account"("providerAccountId") ON DELETE CASCADE ON UPDATE CASCADE;
