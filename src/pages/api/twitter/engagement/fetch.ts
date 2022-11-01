import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
import Client from 'twitter-api-sdk';
type Tweet = components['schemas']['Tweet'];

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('in api liked fetch');
  console.log('req.body', req.body);
  const { accessToken, twtrId } = req.body;

  try {
    if (!accessToken && !twtrId) {
      throw new Error('No access token or twitter id');
    }
    const tClient = new Client(accessToken);

    console.log('api route twitter', accessToken);

    console.log('twtr ID', twtrId);

    const data = await FetchLikes(tClient, twtrId);
    console.log('numTweets', data);
    res.status(200).json({ data });
  } catch (err) {
    console.log('fetch err', err);
    res.status(500).json({ error: err });
  }
}

export async function StoreLikedTweets(
  pc: PrismaClient,
  tweetData: Tweet,
  providerAccountId: any
) {
  console.log('tweets in storetweets');
  const twt = await pc.tweet.create({
    data: {
      id: tweetData.id,
      author: tweetData.author_id!,
      text: tweetData.text,
      likes: tweetData.public_metrics?.like_count,
      retweets: tweetData.public_metrics?.retweet_count,
      entities: tweetData.entities,
      createdAt: tweetData.created_at!,
      user: {},
      userLikes: {
        connect: {
          providerAccountId,
        },
      },
    },
  });
  console.log('liked tweet inserted', twt.id);
  return twt;
}

// Fetches all likes from a specific user from Twitter API
export async function FetchLikes(tClient: Client, twtrId: string) {
  const prisma = new PrismaClient();
  let numTweets = 0;
  console.log('fetching likes');

  // Fetch all likes from Twitter API
  const likes = tClient.tweets.usersIdLikedTweets(twtrId, {
    max_results: 100,
  });
  console.log('likes', likes);

  // Store all likes in database
  for await (const page of likes) {
    for (const tweet of page.data ?? []) {
      console.log('liked tweet: ', tweet);

      await StoreLikedTweets(prisma, tweet, twtrId);
    }
    numTweets += page.data?.length ?? 0;
  }
  console.log('numTweets', numTweets);
  return numTweets;
}
