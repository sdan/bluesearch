// @ts-nocheck
import { useSession } from 'next-auth/react';
import * as React from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { Session } from 'next-auth';

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

  function fetchLikes(args: any) {
    // console.log('access token fetcher', session?.accessToken, session?.twtrId);
    // console.log('arg.accessToken', arg.accessToken);
    // console.log('arg.twtrId', arg.twtrId);
    console.log('FETCHLIKE args', args);
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
  const pullLikesArgs: ApiRequest = {
    accessToken: session?.accessToken,
    twtrId: session?.twtrId,
  };
  if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
    console.log('session?.twtrId', session?.twtrId);
  }

  const { data, error } = useSWR(
    { url: '/api/twitter/inactive/pull', args: pullLikesArgs },
    pullStats
  );
  if (error) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('error', error);
    }
  }
  if (data) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('tweetsFromDB', data['0']);
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
  // const { data: fetchedTweets, error: fetchedTweetError } = useSWR(
  //   { url: '/api/twitter/engagement/fetch', args: fetchTweetArgs },
  //   fetchLikes
  // );

  const {
    data: fetchedTweets,
    trigger,
    isMutating,
    error: fetchedTweetError,
  } = useSWRMutation(
    ['/api/internal/engagement/fetch', fetchTweetArgs],
    fetchLikes
  );

  if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
    console.log('fetchedTweet Error', fetchedTweetError);
    console.log('fetchedTweets', fetchedTweets);
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

          <div className=' flex flex-col py-2'>
            {data[0]['Following'].map((user: any) => (
              <div
                className='flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow-md '
                key={user.id}
              >
                <div className='flex flex-col items-center justify-center'>
                  <p className='text-xl font-bold'>{user.name}</p>
                  <p className='text-gray-500'>@{user.username}</p>
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <p className='text-xl font-bold'>{user.latestLikes} likes</p>
                  <p className='text-gray-500'>
                    {new Date(user.latestLikes).toLocaleDateString()}
                  </p>
                </div>
                <div className='flex items-center justify-center'>
                  {new Date(user.latestLikes) <
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? (
                    <button className='rounded bg-green-500 py-2 px-4 font-bold text-white'>
                      Unfollow
                    </button>
                  ) : (
                    <button className='rounded bg-red-500 py-2 px-4 font-bold text-white'>
                      Active
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* {data && (
            <div className='flex flex-col items-center justify-center py-2'>
              <div className='flex flex-col items-center justify-center py-2'>
                {data[0]['Following'].map((user: any) => (
                  <div key={user.id}>
                    <p>{user.name}</p>
                    <p>{user.latestLikes}</p>
                    <p>{user.latestTweet}</p>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </Layout>
    );
  }
}
