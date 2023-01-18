import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();

export default async function handle(req: any, res: any) {
  console.log('in api pull');
  console.log('req.body', req.body);
  const { query, twtrId } = req.body;
  const waitData = (await SearchTweets(query, twtrId)).tweetlist;
  console.log('waitData data', waitData[0]);
  // return data
  res.status(200).json(waitData);
}

export async function SearchTweets(query: any, twtrId: any) {
  const tweetlist: any = [];

  console.log("session exists and user's twitter id exists");
  const prisma = new PrismaClient();

  //searches tweets for user in their timeline

  return {
    tweetlist,
  };
}
