import * as React from 'react';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';

import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';

import { PrismaClient } from '@prisma/client';
import { Tweet, TwitterContextProvider } from 'react-static-tweets';

type Props = {
  tweetlist: any[];
};

// Import navigation array from Layout component

import { navigation } from '@/components/layout/Layout';

export default function HomePage() {
  const { data: session } = useSession();
  // All navigation array elements are false by default
  navigation.map((item) => (item.current = false));
  navigation[1].current = true;
  const tweetRenderer = (id: string) =>
    fetch(`/api/get-tweet-ast/${id}`).then((r) => r.json());

  const DynamicTweet: React.FC<{ tweetId: string }> = ({ tweetId }) => {
    // console.log('dynamic tweet id', tweetId);
    const { data: tweetAst } = useSWR(tweetId, tweetRenderer);
    if (!tweetAst) return null;

    return (
      <>
        <Tweet id={tweetId} ast={tweetAst} />
      </>
    );
  };

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
    }
    return fetch(args[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: args[1].accessToken,
        twtrId: args[1].twtrId,
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

  const { data, error } = useSWR(
    { url: '/api/twitter/top_liked/pull', args: pullTweetArgs },
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

  const {
    data: fetchedTweets,
    trigger,
    isMutating,
    error: fetchedTweetError,
  } = useSWRMutation(
    ['/api/internal/top_liked/fetch', fetchTweetArgs],
    fetchTweets
  );

  if (fetchedTweetError) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('fetchedTweetError', fetchedTweetError);
    }
  }
  if (fetchedTweets) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('fetchedTweets', fetchedTweets);
    }
  } else {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('no fetchedTweets');
    }
  }

  // if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
  console.log('fetchedTweet Error', fetchedTweetError);
  console.log('fetchedTweets', fetchedTweets);
  // }

  // Design the Top Liked Tweets page with the tweets from the database with a similar style to the rest of the site. Make sure to include a loading state and error state. You can use the `useSWR` hook to fetch the data from the database.
  // Include a refresh button that will fetch the latest tweets from the Twitter API and update the database. You can use the `useSWRMutation` hook to update the database.

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
            Here is your timeline from the past 24 hours sorted by likes. If you
            havent used this in the last 24 hours, hit refresh. Give it a
            second, it might take a while to load if you&apos;re a new user.
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
            <button
              className='block rounded-md bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600'
              onClick={() => {
                trigger();
              }}
            >
              Refresh
            </button>

            {isMutating && (
              <p className='mt-4 text-xl text-gray-500'>
                Refreshing your tweets...
              </p>
            )}

            {fetchedTweetError && (
              <p className='mt-4 text-xl text-gray-500'>
                There was an error refreshing your tweets. Please try again.
              </p>
            )}
          </div>
          <div className='mt-4'>
            {data ? (
              data.TimelineTweets.map((tweet: any) => (
                <DynamicTweet tweetId={tweet.id} key={tweet.id} />
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
