// Pulls twitter following
// Pipes that into GPT-3 with search query

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
import { Configuration, OpenAIApi } from 'openai';

import { PullPromptFollowing, TryFollowing } from './pull';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('in api summary following pull');
  console.log('req.body', req.body);
  const { query, twtrId } = req.body;
  try {
    console.log('twtr ID', twtrId);
    console.log('query', query);

    // Pulls friends
    const friends = await PullPromptFollowing(twtrId);
    console.log('following', friends);

    // Select random group of 75 tweets from timelineTweets array
    const randomFollowing = friends.sort(() => 0.5 - Math.random());
    const selectedFollowing = randomFollowing.slice(0, 75);

    // Generates summary
    const summary = await RunQuery(selectedFollowing, query);

    console.log('following answer:', summary);
    res.status(200).json({ summary });
  } catch (err) {
    console.log('fetch err', err);
    res.status(500).json({ error: err });
  }
}

async function RunQuery(friends: any, query: any) {
  const gpt3 = new OpenAIApi(configuration);
  // Join friends array and append tags to each friend
  const prompt = friends
    .map(
      (friend: any) =>
        `NAME: ${friend[0]}, BIO: ${friend[1]}, LOCATION: ${friend[2]}  `
    )
    .join('\n');
  // Add text to prompt
  const promptText =
    prompt +
    '\n\n ### \nHere is a list of people listed with their name, biography, and location. ' +
    query +
    ' from this list. Be specific and reference direct people.';

  console.log('here is prompt', promptText);
  const response = await gpt3.createCompletion({
    model: 'text-davinci-002',
    prompt: promptText,
    max_tokens: 256,
  });
  return response.data.choices[0].text;
}
