import * as React from 'react';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';

import useSWRMutation from 'swr/mutation';
import useSWRImmutable from 'swr/immutable';
import { PrismaClient } from '@prisma/client';
import { Tweet } from 'react-static-tweets';

type Props = {
  tweetlist: any[];
};

export function refreshSession() {
  const message = { event: 'session', data: { trigger: 'getSession' } };
  localStorage.setItem(
    'nextauth.message',
    JSON.stringify({ ...message, timestamp: Math.floor(Date.now() / 1000) })
  );
}

export default function HomePage() {
  const { data: session } = useSession();

  const [userError, setUserError] = React.useState('');

  //inputtweetid react state of type Input
  //   const [inputTweetId, setInputTweetId] = React.useState('');
  const inputTweetId = '';

  async function sendRequest(url: any, args: any) {
    console.log('sendRequest url', url);
    console.log('sendRequest args', args);
    refreshSession();
    if (!session || !session.accessToken) {
      setUserError('Please sign in');
      signOut();
    }

    console.log('sendRequest session', session?.accessToken);
    if (args.arg && session && session.accessToken) {
      const fetchQuote = await fetch('/api/twitter/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: session.accessToken,
          tweetId: args.arg,
        }),
      });
      const quoteData = await fetchQuote.json();
      console.log('quote fetch data', quoteData);
      return quoteData;
    } else {
      console.log('no args');
      setUserError('try signing again');
    }
  }

  //   const { data, error } = useSWRImmutable(
  //     { url: '/api/twitter/quote', args: inputTweetId },
  //     sendRequest
  //   );

  const { data, trigger, error } = useSWRMutation(
    ['/api/twitter/quote', inputTweetId],
    sendRequest
  );

  if (error) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('useSwr error', error);
    }
  }

  console.log('quote swr data', data);

  return (
    <Layout>
      <Seo templateTitle='Home' />
      <Seo />

      <main>
        <section className='bg-white'>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
            <h1 className='mt-4'>🐥🐥🐥 Tanager 🐥🐥🐥</h1>
            <p className='mt-2 text-sm text-gray-800'>
              Top liked quote tweets{' '}
            </p>
            <p className='mt-2 text-sm text-gray-700'>
              <>
                {/* <ButtonLink
                  className='mt-6'
                  onClick={() => signOut()}
                  variant='light'
                  href={''}
                >
                  sign out
                </ButtonLink> */}
                {/* input that takes tweet link and fetches all quote tweets */}

                <input
                  type='text'
                  placeholder='tweet link'
                  name='tweet'
                  //   onChange={(e) => {
                  //     sendRequest({
                  //       tweetId: e.target.value,
                  //       accessToken: session?.accessToken,
                  //     });
                  //   }}
                  onChange={(e) => {
                    trigger(e.target.value);
                  }}
                />
                {error && (
                  <p className='mt-2 text-sm text-red-800'>{userError}</p>
                )}

                {data &&
                  data.data &&
                  data.data[0].id(
                    <ul>
                      {data.data.map((value: any, index: any) => {
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
                  )}
              </>
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
