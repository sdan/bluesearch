/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Account` table. All the data in the column will be lost.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Session` table. All the data in the column will be lost.
  - Made the column `providerAccountId` on table `Account` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `providerAccountId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
DROP COLUMN "id",
ALTER COLUMN "providerAccountId" SET NOT NULL,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("providerAccountId");

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "id",
ADD COLUMN     "providerAccountId" TEXT NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("providerAccountId");

-- CreateTable
CREATE TABLE "Tweet" (
    "id" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "retweets" INTEGER NOT NULL DEFAULT 0,
    "entities" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_id_key" ON "Tweet"("id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_providerAccountId_fkey" FOREIGN KEY ("providerAccountId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_providerAccountId_fkey" FOREIGN KEY ("providerAccountId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_providerAccountId_fkey" FOREIGN KEY ("providerAccountId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
