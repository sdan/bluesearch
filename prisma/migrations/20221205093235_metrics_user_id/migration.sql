/*
  Warnings:

  - The primary key for the `Metrics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userId` to the `Metrics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Metrics" DROP CONSTRAINT "Metrics_pkey",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Metrics_pkey" PRIMARY KEY ("userId");
