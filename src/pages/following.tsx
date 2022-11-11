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

  // Call frontend endpoint to pull following and summarize with GPT3
  async function sendRequest(args: any) {
    console.log('sendRequest args', args);

    // Checks if we have pulled following before
    const checkPull = await fetch('/api/twitter/following/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        twtrId: args[1].twtrId,
      }),
    });
    const checkFollowers = await checkPull.json();
    if (checkFollowers < 10) {
      console.log('checkFollowers', checkFollowers);
      followingTrigger();
    }

    // If we have pulled following before, then we can pull summary
    const pullSummary = await fetch(args[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: args[1].query,
        twtrId: args[1].twtrId,
      }),
    });
    const summaryData = await pullSummary.json();
    console.log('following fetch data', summaryData);
    return summaryData;
  }

  async function fetchFollowing(args: any) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('F FOLLOW args 2', args);
    }

    return await fetch(args[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: args[1].accessToken,
        twtrId: args[1].twtrId,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const err = new Error('Following fetch response was not ok');
        err.info = await res.json();
        err.status = res.status;
        console.log('FOLLOWING ERROR', err);
        throw err;
      }
      return res.json();
    });
  }

  // Fetch following list and inserts into db
  const followingArgs: ApiRequest = {
    accessToken: session?.accessToken,
    twtrId: session?.twtrId,
    query: searchQuery,
  };

  const {
    data: followingData,
    trigger: followingTrigger,
    isMutating: followingMutating,
    error: followingError,
  } = useSWRMutation(
    ['/api/internal/following/fetch', followingArgs],
    fetchFollowing
  );

  const { data, trigger, isMutating, error } = useSWRMutation(
    ['/api/internal/following/summary', followingArgs],
    sendRequest
  );
  console.log('isMutating', isMutating);
  console.log('error', error);

  if (error) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('useSwr error', error);
    }
  }

  console.log('following swr data', data);
  // Style page with Tailwind CSS that follows the same design as the rest of the site
  // Include a input field for the user to enter a tweet id
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
                Enter something like "who lives in SF" to find all the people
                you follow that live in SF.
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
              <p className='text-left'>
                <div
                  dangerouslySetInnerHTML={{ __html: data?.summary }}
                  style={{ whiteSpace: 'pre-line' }}
                />
              </p>
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
                Smart search through your following
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
