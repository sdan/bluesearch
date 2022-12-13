/*
  Warnings:

  - The `latestTweets` column on the `Metrics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tweets` column on the `Metrics` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Metrics" ADD COLUMN     "fetchedTweets" TIMESTAMP(3)[],
DROP COLUMN "latestTweets",
ADD COLUMN     "latestTweets" INTEGER[],
DROP COLUMN "tweets",
ADD COLUMN     "tweets" INTEGER NOT NULL DEFAULT 0;
