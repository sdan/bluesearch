import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();

export default async function handle(req: any, res: any) {
  console.log('in api pull');
  console.log('req.body', req.body);
  const { accessToken, twtrId } = req.body;
  const waitData = (await PullTweets(twtrId)).tweetlist;
  console.log('waitData data', waitData['TimelineTweets']);
  // return data
  const returnTweets: any = {};
  for (let i = 0; i < waitData['TimelineTweets'].length; i++) {
    const key = waitData['TimelineTweets'][i]['id'];
    const value = waitData['TimelineTweets'][i]['text'];
    console.log('key', key);
    console.log('value', value);
    returnTweets[key] = value;
  }
  res.status(200).json(returnTweets);
}

export async function PullTweets(twtrId: any) {
  let tweetlist: any = [];

  console.log("session exists and user's twitter id exists");
  const prisma = new PrismaClient();

  //find tweets by user id and sort by time for the past 24 hours
  tweetlist = await prisma.account.findFirst({
    where: {
      providerAccountId: twtrId,
    },
    select: {
      TimelineTweets: {
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          createdAt: {
            // Last day
            gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          },
        },
        select: {
          text: true,
          id: true,
        },
      },
    },
  });
  console.log('twtrId in API', twtrId);
  console.log('twts', tweetlist[0]);

  //   return {
  //     tweetlist: JSON.parse(JSON.stringify(tweetlist)),
  //   };
  return {
    tweetlist,
  };
}