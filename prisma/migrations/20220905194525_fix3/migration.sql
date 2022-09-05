/*
  Warnings:

  - Made the column `provider` on table `Account` required. This step will fail if there are existing NULL values in that column.
  - Made the column `providerAccountId` on table `Account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "provider" SET NOT NULL,
ALTER COLUMN "providerAccountId" SET NOT NULL;
