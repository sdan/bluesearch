import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();

// API Handler is just for test, import this function into your API route
export default async function handle(req: any, res: any) {
  console.log('in inactive api pull');
  console.log('req.body', req.body);
  const { accessToken, twtrId } = req.body;
  console.log('accessToken inactive pull frontend', accessToken);
  console.log('twtrId', twtrId);
  const returnTweets = await PullFollowActivity(twtrId);
  // const returnTweets = await PullPromptFollowing(twtrId);
  res.status(200).json(returnTweets);
}

export async function PullFollowActivity(twtrId: any) {
  console.log("session exists and user's list id exists");
  const prisma = new PrismaClient();

  const followActivity = await prisma.account.findFirst({
    where: {
      providerAccountId: twtrId,
    },
    select: {
      Following: {
        orderBy: {
          latestTweet: 'asc',
        },
        select: {
          id: true,
          username: true,
          name: true,
          latestTweet: true,
          latestLikes: true,
          pfp: true,
          bio: true,
        },
      },
    },
  });

  console.log('twtrId in used for follower activity', twtrId);
  return followActivity!['Following'];
}
