import * as React from 'react';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';

import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';

import { PrismaClient } from '@prisma/client';
import { Tweet } from 'react-static-tweets';

type Props = {
  tweetlist: any[];
};

export default function HomePage() {
  const { data: session } = useSession();

  type ApiRequest = {
    accessToken: any;
    twtrId: any;
  };

  function pullTweets(args: any) {
    // console.log('access token fetcher', session?.accessToken, session?.twtrId);
    // console.log('arg.accessToken', arg.accessToken);
    // console.log('arg.twtrId', arg.twtrId);
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('PT args', args);
      console.log('url', args.url);
    }
    return fetch(args.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        twtrId: args.args.twtrId,
      }),
    }).then((res) => res.json());
  }

  function fetchTweets(args: any) {
    // console.log('access token fetcher', session?.accessToken, session?.twtrId);
    // console.log('arg.accessToken', arg.accessToken);
    // console.log('arg.twtrId', arg.twtrId);
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('FT args', args);
      console.log('url', args.url);
    }
    return fetch(args.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: args.args.accessToken,
        twtrId: args.args.twtrId,
      }),
    }).then((res) => res.json());
  }

  // auto fetch from db and conditionally fetch/store tweets
  // keep fetching from db

  // initialize variable args as type ApiRequest
  const pullTweetArgs: ApiRequest = {
    accessToken: '',
    twtrId: session?.twtrId,
  };
  if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
    console.log('session?.twtrId', session?.twtrId);
  }
  // const { data: twtrList } = useSWR(
  //   ['/api/twitter/pull', session?.twtrId],
  //   pullTweets
  // );
  const { data, error } = useSWR(
    { url: '/api/twitter/pull', args: pullTweetArgs },
    pullTweets
  );
  if (error) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('error', error);
    }
  }
  if (data) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('tweetsFromDB', data[0]);
    }
  } else {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('no data');
    }
  }

  const fetchTweetArgs: ApiRequest = {
    accessToken: session?.accessToken,
    twtrId: session?.twtrId,
  };
  const { data: fetchedTweets, error: fetchedTweetError } = useSWR(
    { url: '/api/twitter/fetch', args: fetchTweetArgs },
    fetchTweets
  );
  // if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
  console.log('fetchedTweet Error', fetchedTweetError);
  console.log('fetchedTweets', fetchedTweets);
  // }

  // Design the Top Liked Tweets page with the tweets from the database with a similar style to the rest of the site. Make sure to include a loading state and error state. You can use the `useSWR` hook to fetch the data from the database.
  if (!session) {
    return (
      <Layout>
        <Seo title='Top Liked Tweets' />
        <div className='flex min-h-screen flex-col items-center justify-center py-2'>
          <p className='text-4xl font-bold'>Top Liked Tweets</p>
          <p className='mt-4 text-xl text-gray-500'>
            You must be signed in to view this page.
          </p>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Seo templateTitle='Home' />
        <Seo />
        <div className='flex min-h-screen flex-col items-center justify-center py-2'>
          <p className='text-4xl font-bold'>Top Liked Tweets</p>
          <p className='mt-4 text-xl text-gray-500'>
            Here are your top liked tweets.
          </p>
          <div className='mt-4'>
            <ButtonLink
              href='/'
              className='block rounded-md bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600'
            >
              Back
            </ButtonLink>
          </div>
          <div className='mt-4'>
            {data ? (
              data.map((tweet: any) => (
                <Tweet
                  key={tweet.id}
                  id={tweet.id}
                  className='mt-4 rounded-md border border-gray-300 p-4'
                />
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </Layout>
    );
  }
}
