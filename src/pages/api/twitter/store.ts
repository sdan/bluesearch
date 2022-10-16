// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ fuck: 'you' });
}

export async function StoreTweet(
  pc: PrismaClient,
  tweetData: Tweet,
  providerAccountId: any
) {
  console.log('tweets in storetweets');
  const twt = await pc.tweet.upsert({
    where: {
      id: tweetData.id,
    },
    update: {
      likes: tweetData.public_metrics?.like_count,
    },
    create: {
      id: tweetData.id,
      author: tweetData.author_id!,
      text: tweetData.text,
      likes: tweetData.public_metrics?.like_count,
      retweets: tweetData.public_metrics?.retweet_count,
      entities: tweetData.entities,
      createdAt: tweetData.created_at!,
      user: {
        connect: {
          providerAccountId,
        },
      },
    },
  });
  console.log('tweet inserted', twt);
  return twt;
}
