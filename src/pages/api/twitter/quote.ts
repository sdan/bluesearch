// next js api route that gets all quote tweets for an inputted twitter id
//
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { Client } from 'twitter-api-sdk';
import { StoreTweet } from './store';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
export default async function handle(req: any, res: any) {
  const { accessToken, tweetId } = req.body;
  console.log('in quote api route');
  console.log('req.body', req.body);
  // get the last element of url without the query string
  const lastItem = tweetId.substring(tweetId.lastIndexOf('/') + 1);
  const cleanId = lastItem.split('?')[0];
  console.log('cleanId', cleanId);

  try {
    if (!accessToken && !tweetId) {
      throw new Error('No access token or twitter id');
    }
    const tClient = new Client(accessToken);

    console.log('accessToken', accessToken);

    console.log('tweetId', cleanId);

    const checkTweetId = await tClient.tweets.findTweetById(cleanId);
    console.log('checkTweetId', checkTweetId.data?.id);
    console.log('cleanId', cleanId);
    if (checkTweetId.data?.id != cleanId) {
      throw new Error('Tweet id does not exist');
    }

    const data = await QuoteTweets(tClient, cleanId);
    res.status(200).json({ data });
  } catch (err) {
    console.log('fetch err', err);
    res.status(500).json({ error: err });
  }
}

export async function QuoteTweets(tClient: Client, tweetId: string) {
  let numTweets = 0;
  const getQuoteTweets = tClient.tweets.findTweetsThatQuoteATweet(tweetId, {
    max_results: 100,
    exclude: ['retweets', 'replies'],
    'tweet.fields': [
      'author_id',
      'geo',
      'public_metrics',
      'created_at',
      'entities',
    ],
  });

  const tweetIds = [];
  for await (const page of getQuoteTweets) {
    for (const twt of page.data ?? []) {
      numTweets += 1;
      console.log('tweet text: ', twt.text);
      console.log('tweet id: ', twt.id);
      //   console.log('tweet id: ', twt.id);
      //   console.log('author: ', twt.author_id);
      //   console.log('id: ', twt.id);
      //   console.log('likes:', twt.public_metrics?.like_count);
      //   console.log('retweets:', twt.public_metrics?.retweet_count);
      //   console.log('time: ', twt.created_at);
      //   console.log('entities: ', twt.entities);

      tweetIds.push({
        id: twt.id,
        like_count: twt.public_metrics?.like_count,
      });
    }
  }
  tweetIds.sort((a, b) => (a.like_count! < b.like_count! ? 1 : -1));

  console.log('tweetIds', tweetIds);
  return tweetIds;
}
