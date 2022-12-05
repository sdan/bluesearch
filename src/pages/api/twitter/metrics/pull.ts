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
  const returnTweets = await PullMetrics(twtrId);
  // const returnTweets = await PullPromptFollowing(twtrId);
  res.status(200).json(returnTweets);
}

export async function PullMetrics(twtrId: any) {
  console.log("session exists and user's list id exists");
  const prisma = new PrismaClient();

  const metrics = await prisma.metrics.findMany({
    orderBy: {
      followers: 'desc',
    },
  });

  console.log('twtrId in used for follower activity', twtrId);
  console.log('metrics in used for follower activity', metrics);
  return metrics;
  // return followActivity!['Following'];
}
