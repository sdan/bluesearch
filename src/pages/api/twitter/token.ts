import { PrismaClient } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();
import { NextApiRequest, NextApiResponse } from 'next';
import Client, { auth } from 'twitter-api-sdk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.CRON_SECRET_KEY}`) {
        console.log('cron job running: Refresh All Tokens');
        await RefreshAllTokens();
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

// Goes through all accounts and updates both their refresh and access tokens
export async function RefreshAllTokens() {
  const prisma = new PrismaClient();
  const userlist = await prisma.account.findMany({
    select: {
      providerAccountId: true,
      access_token: true,
      refresh_token: true,
    },
  });

  for (const account of userlist) {
    const { providerAccountId, refresh_token } = account;
    console.log('refreshing tokens for', providerAccountId);
    const newTokens = await RefreshTokens(providerAccountId, refresh_token!);
    await saveTokens(
      providerAccountId,
      newTokens!.access_token!,
      newTokens!.refresh_token!
    );
  }
}

export async function RefreshTokens(
  providerAccountId: string,
  refreshToken: string
) {
  const authClient = new auth.OAuth2User({
    client_id: process.env.TWITTER_CLIENT_ID!,
    client_secret: process.env.TWITTER_CLIENT_SECRET!,
    callback: 'http://sparrowsearch.xyz/api/auth/callback/twitter',
    scopes: [],
    token: {
      refresh_token: refreshToken,
    },
  });

  let resp;
  try {
    resp = await authClient.refreshAccessToken();
  } catch (err) {
    console.log('error refreshing tokens', err);
    return;
  }

  console.log('access token data', resp);

  return saveTokens(
    providerAccountId,
    resp.token.access_token!,
    resp.token.refresh_token!
  );
}

async function saveTokens(
  providerAccountId: string,
  accessToken: string,
  refreshToken: string
) {
  const prisma = new PrismaClient();
  const data = await prisma.account.update({
    where: {
      providerAccountId: providerAccountId,
    },
    data: {
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  });
  console.log('saveTokens data', data);
  return data;
}
