import { PrismaClient } from '@prisma/client';
import { Client } from 'twitter-api-sdk';

const prisma = new PrismaClient();

async function getAccessToken() {
  // const token = await prisma.token.findUnique({
}

export default async function handle(req: any, res: any) {
  const { accessToken } = req.body;
  const tClient = new Client(accessToken);
  // const tClient = new Client(
  //   'AAAAAAAAAAAAAAAAAAAAAEJMZAEAAAAA81C7ZNZ2aZUbFVMiNvL98fgPZzQ%3DaNcYZ6qJgJynX21QIp1NtJVuJxXE1c55OXoGzBPXt3PXnkSlzG'
  // );

  // const tweet = await client.tweets.findTweetById('20');
  // console.log('TWT TWEET DATA', tweet.data.text);
  // console.log('req', req);
  console.log('api route twitter', accessToken);

  // const tweets = await prisma.tweet.findMany();
  // res.status(200).json(tweets);

  // console.log('API ROUTE', tClient);
  // const tweets = await tClient.users.usersIdTimeline('800117847774986240');
  // console.log('rev tweets', tweets);

  // const pages = await tClient.users.usersIdFollowers('800117847774986240');
  // console.log(pages);

  // const flwrs = await tClient.users.usersIdFollowers('800117847774986240');
  // console.log('FLW TWEET', flwrs);

  const {
    data: { id },
  } = await tClient.users.findMyUser();
  console.log('twtr ID', id);

  const params: any = {
    expansions: 'author_id',
    'user.fields': ['username', 'created_at'],
    'tweet.fields': ['geo', 'entities', 'context_annotations'],
  };

  const getUsersTimeline = await tClient.tweets.usersIdTimeline(id, params);
  console.dir(getUsersTimeline, {
    depth: null,
  });

  res.status(200).json({ fuck: 'you' });
}
