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

  const twt = await pc.account.update({
    where: {
      providerAccountId: providerAccountId,
    },
    data: {
      TimelineTweets: {
        connectOrCreate: {
          where: {
            id: tweetData.id,
          },
          create: {
            id: tweetData.id,
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

  console.log('tweet inserted', tweetData.id);
  return twt;
}
