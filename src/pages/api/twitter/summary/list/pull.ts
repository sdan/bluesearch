// Fetches timeline from DB or refreshes DB from Twitter API if DB is empty and calls GPT-3 to generate a summary

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
import { Configuration, OpenAIApi } from 'openai';
import { PullPromptListTweets } from '../promptpull';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('in api summary LIST pull');
  console.log('req.body', req.body);
  const { listId } = req.body;
  try {
    console.log('listId ID', listId);

    // Pulls timeline
    const timelineTweets = await PullPromptListTweets(listId);
    console.log('timelineTweets', timelineTweets);

    // Select random group of 75 tweets from timelineTweets array
    const randomTweets = timelineTweets.sort(() => 0.5 - Math.random());
    const selectedTweets = randomTweets.slice(0, 75);

    // const sliceTweets = timelineTweets.slice(0, 75);

    // Generates summary
    const summary = await GenerateSummary(selectedTweets);

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
    '\n\n ### \nHere is a feed of tweets. Give me a summary of the 5 most insightful or eventful tweets in the feed. Be specific and reference direct people.';

  console.log('here is prompt', promptText);
  const response = await gpt3.createCompletion({
    model: 'text-davinci-002',
    prompt: promptText,
    max_tokens: 256,
  });
  return response.data.choices[0].text;
}
