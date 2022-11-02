import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
import { UserIdToUsername } from './fetch';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();

export default async function handle(req: any, res: any) {
  console.log('in api pull');
  console.log('req.body', req.body);
  const { accessToken, twtrId } = req.body;
  const waitData = await PullTweets(twtrId);
  console.log('waitData data', waitData);
  // return map of data
  res.status(200).json(waitData);
}

export async function PullTweets(twtrId: any) {
  let tweetlist: any = [];

  console.log("session exists and user's twitter id exists");
  const prisma = new PrismaClient();

  // find userLikes by user id and sort by likes in descending order (most likes first) for the past 24 hours
  tweetlist = await prisma.account.findFirst({
    where: {
      providerAccountId: twtrId,
    },
    select: {
      LikedTweets: {
        orderBy: {
          likes: 'desc',
        },
        where: {
          createdAt: {
            // Last day
            gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  console.log('twtrId in API', twtrId);
  console.log('twts', tweetlist[0]);
  return await EngagementStats(tweetlist);
}

type EngagementStat = {
  username: string;
  frequency: number;
};
// Pull users likes and ranks their following by the number of tweets the user has liked from them
export async function EngagementStats(tweelist: any) {
  console.log('in engagement stats');
  console.log('tweetlist l', tweelist['LikedTweets']);
  const tweetlist = tweelist.LikedTweets;
  // Make object of users and number of tweets liked from them
  const userEngagement: any = {};
  for (let i = 0; i < tweetlist.length; i++) {
    const username = (await UserIdToUsername(tweetlist[i].author)) || '';
    if (userEngagement[username]) {
      userEngagement[username] += 1;
    } else {
      userEngagement[username] = 1;
    }
  }
  console.log('userEngagement', userEngagement);
  // Sort object by number of tweets liked from them
  const sortedUserEngagement: any = {};
  Object.keys(userEngagement)
    .sort(function (a, b) {
      return userEngagement[b] - userEngagement[a];
    })
    .forEach(function (v) {
      sortedUserEngagement[v] = userEngagement[v];
    });
  console.log('sortedUserEngagement', sortedUserEngagement);
  return sortedUserEngagement;
}
