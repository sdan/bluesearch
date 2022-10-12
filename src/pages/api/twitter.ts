import { PrismaClient } from '@prisma/client';
import { Client } from 'twitter-api-sdk';
import { saveTweet } from './storetweets';
import { components } from 'twitter-api-sdk/dist/types';
type Tweet = components['schemas']['Tweet'];
const prisma = new PrismaClient();

export default async function handle(req: any, res: any) {
  console.log('req.body', req.body);
  const { accessToken } = req.body;
  const tClient = new Client(accessToken);

  console.log('api route twitter', accessToken);

  // const tweets = await prisma.tweet.findMany();
  // res.status(200).json(tweets);

  const {
    data: { id },
  } = await tClient.users.findMyUser();

  console.log('twtr ID', id);

  const params = {
    max_results: 100,
    // 'user.fields': ['username', 'created_at'],
    'tweet.fields': [
      'author_id',
      'geo',
      'public_metrics',
      'created_at',
      'entities',
    ],
  };

  const getUsersTimeline = tClient.tweets.usersIdTimeline(id, params);
  let numTweets = 0;

  for await (const page of getUsersTimeline) {
    // console.log('like counts: ', page?.data?.public_metrics?.like_count);
    // const twett:types.tweet
    let twt: Tweet;
    for (twt of page.data) {
      console.log('Tweet: ', twt.text);
      console.log('author: ', twt.author_id);
      console.log('id: ', twt.id);
      console.log('likes:', twt.public_metrics?.like_count);
      console.log('retweets:', twt.public_metrics?.retweet_count);
      console.log('time: ', twt.created_at);
      console.log('entities: ', twt.entities);
      await saveTweet(prisma, twt, id);
    }
    numTweets += page?.meta?.result_count || 0;
    // console.log('pag tweet', page);
    console.log('cumtweets:', numTweets);
  }

  console.log('GUT INCLUDES', getUsersTimeline.meta);

  res.status(200).json({ fuck: 'you' });
}
