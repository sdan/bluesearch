import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();

// API Handler is just for test, import this function into your API route
export default async function handle(req: any, res: any) {
  console.log('in inactive api pull');
  console.log('req.body', req.body);
  const { accessToken, twtrId, page } = req.body;
  console.log('aT metrics pull frontend', accessToken);
  console.log('twtrId', twtrId);
  console.log('page', page);
  const returnTweets = await PullMetrics(twtrId, page);
  // const returnTweets = await PullPromptFollowing(twtrId);
  res.status(200).json(returnTweets);
}

export async function PullMetrics(twtrId: any, page: number) {
  if (page != undefined) {
    console.log("session exists and user's list id exists");
    const prisma = new PrismaClient();

    // only get first 100 tweets
    console.log('PAGE IN PULL METRICS', page);
    const metrics = await prisma.metrics.findMany({
      skip: page * 100,
      take: 100,
      orderBy: {
        followers: 'desc',
      },
    });

    // Count how many metrics are in the database
    const metricsCount = await prisma.metrics.count();
    // Take floor of metrics divined by 100
    // let pages = Math.floor(metricsCount / 100);
    // // Get the remainder
    // const remainder = metricsCount % 100;
    // // If the remainder is greater than 0, add 1 to pages
    // if (remainder > 0) {
    //   pages += 1;
    // }

    console.log('twtrId in used for follower activity', twtrId);
    // console.log('metrics in used for follower activity', metrics);
    return [metrics, metricsCount];
    // return followActivity!['Following'];
  } else {
    return;
  }
}

export async function PullMetricsStats(twtrId: any) {
  console.log("session exists and user's list id exists");
  const prisma = new PrismaClient();

  // Count how many metrics are in the database
  const metrics = await prisma.metrics.count();
  // Take floor of metrics divined by 100
  let pages = Math.floor(metrics / 100);
  // Get the remainder
  const remainder = metrics % 100;
  // If the remainder is greater than 0, add 1 to pages
  if (remainder > 0) {
    pages += 1;
  }

  console.log('pages', pages);
  console.log('remainder', remainder);

  return pages;
  // return followActivity!['Following'];
}
