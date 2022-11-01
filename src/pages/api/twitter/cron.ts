import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();
import { NextApiRequest, NextApiResponse } from 'next';
import Client, { auth } from 'twitter-api-sdk';
import { StoreTweet } from './top_liked/store';
import { RefreshTokens } from './token';
// pages/api/cron.ts

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.CRON_SECRET_KEY}`) {
        console.log('cron job running');
        await UpdateTimeline();
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export async function UpdateTimeline() {
  const prisma = new PrismaClient();
  const userlist = await prisma.account.findMany({
    select: {
      providerAccountId: true,
      access_token: true,
      refresh_token: true,
    },
  });

  console.log('userlist', userlist);

  for (const user of userlist) {
    const accessToken = user.access_token!;
    console.log('accessToken', accessToken);
    const refreshToken = user.refresh_token!;
    console.log('refreshToken', refreshToken);
    const twtrId = user.providerAccountId!;
    console.log('fetching tweets', twtrId);

    const authClient = new auth.OAuth2User({
      client_id: process.env.TWITTER_CLIENT_ID!,
      client_secret: process.env.TWITTER_CLIENT_SECRET!,
      callback: 'http://tanager.app/api/auth/callback/twitter',
      scopes: [],
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });

    const tClient = new Client(authClient);

    // Verify refresh token is still valid
    try {
      const isValid = await tClient.users.findMyUser();
    } catch (err) {
      console.log('Stores refresh token expired', err);
      throw new Error('Failed to generate refresh tokens');
    }

    const getUsersTimeline = tClient.tweets.usersIdTimeline(twtrId, {
      max_results: 100,
      start_time: new Date(Date.now() - 86400000).toISOString(),
      'tweet.fields': [
        'author_id',
        'geo',
        'public_metrics',
        'created_at',
        'entities',
      ],
    });
    console.log('getUsersTimeline', getUsersTimeline);
    let numTweets = 0;
    let insertedTweet: any;
    let twt: Tweet;

    for await (const page of getUsersTimeline) {
      for (twt of page.data ?? []) {
        console.log('tweet id: ', twt.id);
        // console.log('author: ', twt.author_id);
        // console.log('id: ', twt.id);
        console.log('likes:', twt.public_metrics?.like_count);
        // console.log('retweets:', twt.public_metrics?.retweet_count);
        // console.log('time: ', twt.created_at);
        // console.log('entities: ', twt.entities);
        insertedTweet = await StoreTweet(prisma, twt, twtrId);
      }
      numTweets += page?.meta?.result_count || 0;
    }
  }
}
