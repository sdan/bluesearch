import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();

// API Handler is just for test, import this function into your API route
export default async function handle(req: any, res: any) {
  console.log('in api pull');
  console.log('req.body', req.body);
  const { accessToken, twtrId } = req.body;
  const returnTweets = await PullPromptFollowing(twtrId);
  res.status(200).json(returnTweets);
}

export async function PullPromptFollowing(twtrId: any) {
  let followList: any = [];

  console.log("session exists and user's list id exists");
  const prisma = new PrismaClient();

  followList = await prisma.account.findMany({
    where: {
      providerAccountId: twtrId,
    },
    select: {
      Following: {
        select: {
          id: true,
          username: true,
          name: true,
          bio: true,
          location: true,
          url: true,
          followers: true,
          following: true,
          likes: true,
        },
      },
    },
  });

  console.log('twtrId in API', twtrId);
  console.log('twts', followList[0]);

  const returnTweets: any = [];
  // Make array of tweets
  followList.forEach((tweet: any) => {
    returnTweets.push(tweet.text);
  });

  console.log('returnTweets', returnTweets);

  return returnTweets;
}
