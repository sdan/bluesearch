// checks if we need to fetch following again
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('in internal api');
  console.log('req.body', req.body);
  const { twtrId } = req.body;
  const followers = await TryFollowing(twtrId);

  res.status(200).json(followers);
}

export async function TryFollowing(twtrId: any) {
  console.log("session exists and user's list id exists");
  const prisma = new PrismaClient();

  console.log('twtrId', twtrId);

  const followcount = await prisma.account.findMany({
    where: {
      providerAccountId: twtrId,
    },
    select: {
      _count: {
        select: {
          Following: true,
        },
      },
    },
  });

  console.log('twtrId in API', twtrId);
  console.log('followcount', followcount[0]._count.Following);
  return followcount[0]._count.Following;
}
