import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();

// API Handler is just for test, import this function into your API route
export default async function handle(req: any, res: any) {
  console.log('in api pull');
  console.log('req.body', req.body);
  const { accessToken, listId } = req.body;
  const returnTweets = await PullPromptListTweets(listId);
  res.status(200).json(returnTweets);
}

export async function PullPromptListTweets(listId: any) {
  let tweetlist: any = [];

  console.log("session exists and user's list id exists");
  const prisma = new PrismaClient();

  tweetlist = await prisma.listTweets.findMany({
    where: {
      listId: listId,
      createdAt: {
        // Last day
        gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      },
    },
    select: {
      text: true,
      author: true,
    },
  });

  console.log('twtrId in API', listId);
  console.log('twts', tweetlist[0]);

  const returnTweets: any = [];
  // Make array of tweets
  tweetlist.forEach((tweet: any) => {
    returnTweets.push(tweet.text);
  });

  console.log('returnTweets', returnTweets);

  return returnTweets;
}

export async function PullPromptTweets(twtrId: any) {
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
          author: true,
        },
      },
    },
  });
  console.log('twtrId in API', twtrId);
  console.log('twts', tweetlist[0]);
  console.log('tweetlist data', tweetlist['TimelineTweets']);
  // return data
  const returnTweets = [];
  // Make array of tweets

  for (let i = 0; i < tweetlist['TimelineTweets'].length; i++) {
    returnTweets[i] = tweetlist['TimelineTweets'][i]['text'];
  }

  // for (let i = 0; i < tweetlist['TimelineTweets'].length; i++) {
  //   const key = tweetlist['TimelineTweets'][i]['author'];
  //   const value = tweetlist['TimelineTweets'][i]['text'];
  //   console.log('key', key);
  //   console.log('value', value);
  //   returnTweets[key] = value;
  // }
  return returnTweets;
}
