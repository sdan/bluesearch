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
  const returnTweets = await TryFollowing(twtrId);
  // const returnTweets = await PullPromptFollowing(twtrId);
  res.status(200).json(returnTweets);
}

export async function TryFollowing(twtrId: any) {
  console.log("session exists and user's list id exists");
  const prisma = new PrismaClient();

  console.log('twtrId', twtrId);

  const followcount = await prisma.account.findMany({
    where: {
      providerAccountId: twtrId,
    },
    select: {
      _count: {
        select: {
          Following: true,
        },
      },
    },
  });

  console.log('twtrId in API', twtrId);
  console.log('followcount', followcount[0]._count.Following);
  return followcount[0]._count.Following;
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
          tweets: true,
        },
      },
    },
  });

  console.log('twtrId in API', twtrId);
  console.log('flwng', followList[0].Following[0]);

  const parseTweets: any = followList[0].Following;
  const returnTweets: any = [];
  // Make array of tweets
  parseTweets.forEach((friend: any) => {
    returnTweets.push([friend.name, friend.bio, friend.location]);
  });

  console.log('returnTweets', returnTweets);

  return returnTweets;
}
