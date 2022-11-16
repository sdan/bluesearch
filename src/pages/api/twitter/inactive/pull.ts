import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();

// API Handler is just for test, import this function into your API route
export default async function handle(req: any, res: any) {
  console.log('in api pull');
  console.log('req.body', req.body);
  const { accessToken, twtrId } = req.body;
  console.log('accessToken', accessToken);
  console.log('twtrId', twtrId);
  const returnTweets = await PullFollowActivity(twtrId);
  // const returnTweets = await PullPromptFollowing(twtrId);
  res.status(200).json(returnTweets);
}

export async function PullFollowActivity(twtrId: any) {
  console.log("session exists and user's list id exists");
  const prisma = new PrismaClient();

  console.log('twtrId', twtrId);

  const followActivity = await prisma.account.findMany({
    where: {
      providerAccountId: twtrId,
    },
    select: {
      Following: {
        select: {
          id: true,
          username: true,
          name: true,
          latestLikes: true,
          latestTweet: true,
        },
      },
    },
  });

  console.log('twtrId in API', twtrId);
  console.log('followActivity', followActivity);
  return followActivity;
}
