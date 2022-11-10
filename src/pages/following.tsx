import * as React from 'react';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';

import useSWRMutation from 'swr/mutation';
import useSWRImmutable from 'swr/immutable';
import { PrismaClient } from '@prisma/client';
import { Tweet } from 'react-static-tweets';

export default function HomePage() {
  const { data: session } = useSession();

  const [userError, setUserError] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');

  async function sendRequest(url: any, args: any) {
    console.log('sendRequest url', url);
    console.log('sendRequest args', args);

    console.log('sendRequest session', session?.accessToken);
    console.log('sendRequest session', session);

    if (args.arg && session && session.accessToken) {
      const fetchQuote = await fetch('/api/twitter/following', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: session.accessToken,
          searchQuery: args.arg,
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

  const { data, trigger, isMutating, error } = useSWRMutation(
    ['/api/twitter/following', searchQuery],
    sendRequest
  );
  console.log('isMutating', isMutating);
  console.log('error', error);

  if (error) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('useSwr error', error);
    }
  }

  console.log('quote swr data', data);
  // Style page with Tailwind CSS that follows the same design as the rest of the site
  // Include a input field for the user to enter a tweet id
  // Show the quote tweet if the user has entered a tweet id and the quote tweet is found and a loading indicator if the quote tweet is being fetched and an error message if the quote tweet is not found
  if (session) {
    return (
      <Layout>
        <Seo templateTitle='Smart search through following' />
        <Seo />

        <main>
          <section className='bg-white'>
            <div className='layout flex flex-col items-center justify-center text-center text-black'>
              <h1 className='mt-8 text-4xl md:text-6xl'>
                Smart search through your following
              </h1>
              <p className='mt-4 md:text-lg'>
                Enter something like "Pull all the artists I follow" to find all
                the artists you follow.
              </p>

              <p className='mt-2 text-sm text-gray-700'>
                <>
                  <input
                    type='text'
                    className='mt-2 rounded-md border border-gray-300 p-2'
                    placeholder='Enter a search query'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className='mt-2 rounded-md border border-gray-300 p-2'
                    onClick={() => {
                      trigger(searchQuery);
                    }}
                  >
                    Search
                  </button>
                </>
              </p>
              <p className='mt-2 text-sm text-gray-700'>
                {isMutating ? 'Loading...' : ''}
              </p>
              <p className='mt-2 text-sm text-gray-700'>
                {userError ? userError : ''}
              </p>
              <span className='mt-2 text-sm text-gray-700'>
                {data && data.data && (
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
              </span>
            </div>
          </section>
        </main>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Seo templateTitle='Smart search through following' />
        <Seo />

        <main>
          <section className='bg-white'>
            <div className='layout flex flex-col items-center justify-center text-center text-black'>
              <h1 className='mt-8 text-4xl md:text-6xl'>
                Top liked quote tweet
              </h1>
              <p className='mt-4 md:text-lg'>You are currently not signed in</p>
              <p className='mt-2 text-sm text-gray-700'>
                <>
                  <button
                    onClick={() => signIn('twitter')}
                    className='flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg'
                  >
                    Sign in with Twitter
                  </button>
                </>
              </p>
            </div>
          </section>
        </main>
      </Layout>
    );
  }
}
