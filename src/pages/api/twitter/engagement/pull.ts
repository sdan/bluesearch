import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();

export default async function handle(req: any, res: any) {
  console.log('in api pull');
  console.log('req.body', req.body);
  const { accessToken, twtrId } = req.body;
  const waitData = (await PullTweets(twtrId)).tweetlist;
  console.log('waitData data', waitData[0]);
  // return data
  res.status(200).json(waitData);
}

export async function PullTweets(twtrId: any) {
  let tweetlist: any = [];

  console.log("session exists and user's twitter id exists");
  const prisma = new PrismaClient();

  //find tweets by user id and sort by likes in descending order (most likes first) for the past 24 hours
  //   tweetlist = await prisma.tweet.findMany({
  //     orderBy: {
  //       likes: 'desc',
  //     },
  //     where: {
  //       userId: twtrId,
  //       name: 'LikedTweets',
  //       createdAt: {
  //         gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  //       },
  //     },
  //   });

  // find userLikes by user id and sort by likes in descending order (most likes first) for the past 24 hours
  tweetlist = await prisma.account.findMany({
    where: {
      userId: twtrId,
    },
    include: {
      LikedTweets: {
        where: {
          createdAt: {
            // Last week
            gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          },
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
