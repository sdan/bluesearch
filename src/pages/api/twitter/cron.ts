import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();
import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'twitter-api-sdk';
import { FetchTweets } from './fetch';
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
        UpdateTimeline();
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
    },
  });

  for (const user of userlist) {
    const accessToken = user.providerAccountId;
    const tClient = new Client(accessToken);
    console.log('fetching tweets', user.providerAccountId);
    FetchTweets(tClient, accessToken);
  }
}
