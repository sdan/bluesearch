// Pulls twitter following
// Pipes that into GPT-3 with search query

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
import { Configuration, OpenAIApi } from 'openai';

import { PullPromptFollowing } from './pull';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('in api summary following pull');
  console.log('req.body', req.body);
  const { twtrId } = req.body;
  try {
    console.log('twtr ID', twtrId);

    // Pulls timeline
    const following = await PullPromptFollowing(twtrId);
    console.log('following', following);

    // Select random group of 75 tweets from timelineTweets array
    const randomFollowing = following.sort(() => 0.5 - Math.random());
    const selectedFollowing = randomFollowing.slice(0, 75);

    // const sliceTweets = timelineTweets.slice(0, 75);

    // Generates summary
    const summary = await GenerateSummary(selectedFollowing);

    console.log('th e summary', summary);
    res.status(200).json({ summary });
  } catch (err) {
    console.log('fetch err', err);
    res.status(500).json({ error: err });
  }
}

async function GenerateSummary(tweets: any) {
  const gpt3 = new OpenAIApi(configuration);
  const prompt = tweets.join('\n\n');
  // Add text to prompt
  const promptText =
    prompt +
    '\n\n ### \nHere is a feed of tweets. Give me a brief summary of what the particularly newsworthy tweets are about. Be specifc which tweets.';

  console.log('here is prompt', promptText);
  const response = await gpt3.createCompletion({
    model: 'text-davinci-002',
    prompt: promptText,
    max_tokens: 256,
  });
  return response.data.choices[0].text;
}
