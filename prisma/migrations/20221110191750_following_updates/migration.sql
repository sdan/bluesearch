/*
  Warnings:

  - You are about to drop the column `likes` on the `Following` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Following" DROP COLUMN "likes",
ADD COLUMN     "tweets" INTEGER DEFAULT 0,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "url" DROP NOT NULL;
