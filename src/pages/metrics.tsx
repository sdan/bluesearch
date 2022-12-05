import * as React from 'react';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';

import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';

import { PrismaClient } from '@prisma/client';
import { Tweet, TwitterContextProvider } from 'react-static-tweets';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { userAgent } from 'next/server';
Chart.register(...registerables);

type Props = {
  tweetlist: any[];
};

export default function HomePage() {
  const { data: session } = useSession();

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

  const testChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'First dataset',
        data: [33, 53, 85, 41, 44, 65],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Second dataset',
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        borderColor: '#742774',
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  function pullMetrics(args: any) {
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

  function fetchMetrics(args: any) {
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

  const { data: metricsData, error: metricsError } = useSWR(
    { url: '/api/twitter/metrics/pull', args: pullTweetArgs },
    pullMetrics
  );
  if (metricsError) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('metricsError', metricsError);
    }
  }
  if (metricsData) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('tweetsFromDB', metricsData[0]);
    }
  } else {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('no data');
    }
  }

  const fetchMetricsArgs: ApiRequest = {
    accessToken: session?.accessToken,
    twtrId: session?.twtrId,
  };

  const {
    data: fetchedTweets,
    trigger,
    isMutating,
    error: fetchedTweetError,
  } = useSWRMutation(
    ['/api/internal/metrics/fetch', fetchMetricsArgs],
    fetchMetrics
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
        <Seo title='Metrics' />
        <div className='flex min-h-screen flex-col items-center justify-center py-2'>
          <p className='mt-4 text-xl text-gray-500'>
            You must be signed in to view this page.
          </p>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Seo title='Metrics' />
        <div className='flex flex-col items-center justify-center py-2'>
          <div className='flex flex-col items-center justify-center py-2'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Twitter Metrics
            </h1>
            <p className='mt-4 text-xl text-gray-500'>
              This page is under construction.
            </p>
            <p className='mt-4 text-xl text-gray-500'>
              This page will display public metrics for everyone you follow
              (currently). As more people use this app, you will be able to see
              metrics for everyone.
            </p>
            <p className='mt-4 text-xl text-gray-500'>
              You can also refresh the metrics here.
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center py-2'>
          <button
            className='block rounded-md bg-blue-500 px-4 py-2 text-center text-white hover:bg-blue-600'
            onClick={() => {
              trigger();
            }}
          >
            Hard pull metrics
          </button>
        </div>
        {metricsData ? (
          metricsData.map((user: any) => (
            <div
              className='flex flex-col items-center justify-center py-2'
              key={user.id}
            >
              <h1 className='text-center text-2xl font-bold'>
                {user.name} has {user.followers} followers
              </h1>

              {user.latestFollowers.length > 1 ? (
                <h2 className='text-center text-xl font-bold  text-green-500'>
                  +
                  {user.latestFollowers[user.latestFollowers.length - 1] -
                    user.latestFollowers[user.latestFollowers.length - 2]}{' '}
                  followers from{' '}
                  {user.fetchedFollowers[user.fetchedFollowers.length - 2]}
                </h2>
              ) : (
                <> </>
              )}
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center py-2'>
            <h1 className='text-center text-2xl font-bold'>No metrics found</h1>
          </div>
        )}
        {/* <Line data={testChartData} /> */}
      </Layout>
    );
  }
}
