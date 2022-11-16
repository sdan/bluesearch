-- AlterTable
ALTER TABLE "Following" ADD COLUMN     "latestLikes" TIMESTAMP(3),
ADD COLUMN     "latestTweet" TIMESTAMP(3);
