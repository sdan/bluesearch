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
  console.log('fetchedTweets', fetchedTweetError);
  console.log('fetchedTweets', fetchedTweets);
  // }

  return (
    <Layout>
      <Seo templateTitle='Home' />
      <Seo />

      <main>
        <section className='bg-white'>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
            <h1 className='mt-4'>🐥🐥🐥 **still in progress** 🐥🐥🐥</h1>
            <p className='mt-2 text-sm text-gray-800'>
              Top liked quote tweets{' '}
            </p>
            <p className='mt-2 text-sm text-gray-700'>
              <>
                <ButtonLink
                  className='mt-6'
                  onClick={() => signOut()}
                  variant='light'
                  href={''}
                >
                  sign out
                </ButtonLink>
                {/* <ButtonLink
                    className='mt-6'
                    onClick={() =>
                      trigger({
                        accessToken: session.accessToken!,
                        twtrId: session.twtrId!,
                      })
                    }
                    variant='dark'
                    href={''}
                  >
                    fetch tweets
                  </ButtonLink> */}
              </>
            </p>

            {data ? (
              <ul>
                {data.map((value: any, index: any) => {
                  return (
                    <>
                      <li key={index}>
                        <Tweet id={value.id} />
                      </li>
                      <br></br>
                    </>
                  );
                })}
              </ul>
            ) : (
              <p>no tweets</p>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
