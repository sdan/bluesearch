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
  let bearerToken;
  try {
    bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (!bearerToken && !twtrId) {
      throw new Error('No bearer token or twitter id');
    }
    console.log('bearerToken', bearerToken);

    const tClient = new Client(bearerToken!);

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
  username: string,
  providerAccountId: any
) {
  console.log('tweets in storetweets');

  const twt = await pc.account.update({
    where: {
      providerAccountId: providerAccountId,
    },
    data: {
      LikedTweets: {
        connectOrCreate: {
          where: {
            id: tweetData.id,
          },
          create: {
            id: tweetData.id,
            username: username,
            author: tweetData.author_id!,
            text: tweetData.text,
            likes: tweetData.public_metrics?.like_count,
            retweets: tweetData.public_metrics?.retweet_count,
            entities: tweetData.entities,
            createdAt: tweetData.created_at!,
          },
        },
      },
    },
  });

  console.log('liked tweet inserted', tweetData.id);
  return twt;
}

export async function UserIdToUsername(twtrId: string) {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  const tClient = new Client(bearerToken!);
  const user = await tClient.users.findUserById(twtrId);
  return user.data?.username;
}

// Fetches all likes from a specific user from Twitter API
export async function FetchLikes(tClient: Client, twtrId: string) {
  const prisma = new PrismaClient();
  let numTweets = 0;
  console.log('fetching likes');

  // Fetch all likes from Twitter API
  const likes = tClient.tweets.usersIdLikedTweets(twtrId, {
    max_results: 100,
    'tweet.fields': [
      'author_id',
      'geo',
      'public_metrics',
      'created_at',
      'entities',
    ],
  });
  console.log('likes', likes);

  // Store all likes in database
  for await (const page of likes) {
    for (const tweet of page.data ?? []) {
      console.log('page user ', page.includes?.users);
      console.log('liked tweet: ', tweet);
      const username = (await UserIdToUsername(tweet.author_id!)) || '';

      await StoreLikedTweets(prisma, tweet, username, twtrId);
    }
    numTweets += page.data?.length ?? 0;
  }
  console.log('numTweets', numTweets);
  return numTweets;
}
