// Fetches timeline from DB or refreshes DB from Twitter API if DB is empty and calls GPT-3 to generate a summary

import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'twitter-api-client';
import { PrismaClient, Prisma } from '@prisma/client';
import { components } from 'twitter-api-sdk/dist/types';
import { Configuration, OpenAIApi } from 'openai';
import { PullPromptTweets } from '../top_liked/promptpull.ts';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('in api summary pull');
  console.log('req.body', req.body);
  const { twtrId } = req.body;
  try {
    console.log('twtr ID', twtrId);

    // Pulls timeline
    const timelineTweets = await PullPromptTweets(twtrId);

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
    '###\n\nHere is a feed of tweets. Give me a detailed breif of good tweets. Be specifc and highlight good tweets.\n\n';

  console.log('here is prompt', promptText);
  const response = await gpt3.createCompletion({
    model: 'text-davinci-002',
    prompt: promptText,
    max_tokens: 256,
  });
  return response.data.choices[0].text;
}
