// @ts-nocheck
import { useSession } from 'next-auth/react';
import * as React from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { Session } from 'next-auth';
import moment from 'moment';

export default function HomePage() {
  const { data: session } = useSession();

  type ApiRequest = {
    accessToken: any;
    twtrId: any;
  };

  function pullStats(args: any) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('PT args', args);
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

  function fetchStats(args: any) {
    // console.log('access token fetcher', session?.accessToken, session?.twtrId);
    // console.log('arg.accessToken', arg.accessToken);
    // console.log('arg.twtrId', arg.twtrId);
    console.log('fetchStats args', args);
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('LT args', session?.accessToken);
      console.log('LT twtrid', session?.twtrId);
    }
    return fetch(args[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: args[1]?.accessToken,
        twtrId: args[1]?.twtrId,
      }),
    }).then((res) => res.json());
  }

  // auto fetch from db and conditionally fetch/store tweets
  // keep fetching from db

  // initialize variable args as type ApiRequest
  const pullFollowerActivityArgs: ApiRequest = {
    accessToken: session?.accessToken,
    twtrId: session?.twtrId,
  };
  if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
    console.log('session?.twtrId', session?.twtrId);
  }

  const { data, error } = useSWR(
    { url: '/api/twitter/inactive/pull', args: pullFollowerActivityArgs },
    pullStats
  );
  if (error) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('inactive error', error);
    }
  }
  if (data) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('tweetsFromDB', data);
    }
  } else {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('no inactive data', data);
    }
  }

  const fetchStatsArgs: ApiRequest = {
    accessToken: session?.accessToken,
    twtrId: session?.twtrId,
  };
  const {
    data: fetchedStats,
    trigger,
    isMutating,
    error: fetchedStatsError,
  } = useSWRMutation(
    ['/api/internal/inactive/fetch', fetchStatsArgs],
    fetchStats
  );

  if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
    console.log('fetchedTweet Error', fetchedStatsError);
    console.log('fetchedTweets', fetchedStats);
  }
  console.log('tweet data', data);
  // Design the Top Liked Tweets page with the tweets from the database with a similar style to the rest of the site. Make sure to include a loading state and error state. You can use the `useSWR` hook to fetch the data from the database.
  // Iterate through data object or display loading state
  if (!session) {
    return (
      <Layout>
        <Seo title='Inactive people you follow' />
        <div className='flex min-h-screen flex-col items-center justify-center py-2'>
          <p className='text-4xl font-bold'>Inactive people you follow</p>
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
          <p className='text-4xl font-bold'>Inactive people you follow</p>
          <p className='mt-4 text-xl text-gray-500'>
            Here are the people you follow who have not been active recently
          </p>

          <div className='flex flex-col items-center justify-center py-2'>
            <button
              className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
              onClick={() => trigger(fetchStatsArgs)}
            >
              Fetch users
            </button>
            {isMutating && <p>Fetching users...</p>}
          </div>
          <div className='flex w-full flex-1 flex-col items-center justify-center px-20 text-center'>
            {data ? (
              data.map((user) => (
                <div
                  key={user.id}
                  className='flex flex-row justify-center space-x-4'
                >
                  <img
                    src={user.profile_image_url}
                    className='h-16 w-16 rounded-full'
                  />
                  <p className='font-bold'>{user.name}</p>
                  <p className='font-bold'>{user.username}</p>
                  <p className='font-bold'>
                    {moment(user.latestLikes).fromNow()}
                  </p>
                  {/* <button className='rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'>
                    Unfollow
                  </button> */}
                </div>
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
