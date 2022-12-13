-- AlterTable
ALTER TABLE "Metrics" ADD COLUMN     "latestTweets" TIMESTAMP(3)[],
ADD COLUMN     "tweets" INTEGER[];
