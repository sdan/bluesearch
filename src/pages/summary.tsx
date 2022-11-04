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

export default function HomePage() {
  const { data: session } = useSession();

  const [userError, setUserError] = React.useState('');

  async function sendRequest(args: any) {
    console.log('sendRequest args', args);

    const fetchSummary = await fetch(args[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        twtrId: args[1],
      }),
    });

    const summaryData = await fetchSummary.json();
    console.log('summaryData fetch data', summaryData);
    return summaryData;
  }

  const { data, trigger, isMutating, error } = useSWRMutation(
    ['/api/twitter/summary/pull', session?.twtrId],
    sendRequest
  );
  console.log('isMutating', isMutating);
  console.log('error', error);

  if (error) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('useSwr error', error);
    }
  }

  console.log('summary swr data', data);

  // Style page with Tailwind CSS that follows the same design as the rest of the site
  // Include a input field for the user to enter a tweet id
  // Show the quote tweet if the user has entered a tweet id and the quote tweet is found and a loading indicator if the quote tweet is being fetched and an error message if the quote tweet is not found
  if (session) {
    return (
      <Layout>
        <Seo templateTitle='Summary' />
        <Seo />

        <main>
          <section className='bg-white'>
            <div className='layout flex flex-col items-center justify-center text-center text-black'>
              <h1 className='mt-8 text-4xl md:text-6xl'>
                Summary of your timeline
              </h1>
              <p className='mt-4 md:text-lg'>
                This page shows a summary of your timeline
              </p>
            </div>
            <div>
              <p className='mt-2 text-sm text-gray-700'>
                <>
                  <button
                    className='mt-2 rounded-md border border-gray-300 p-2'
                    onClick={() => {
                      trigger();
                    }}
                  >
                    Refresh timeline
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
                {data ? <p>{data.summary}</p> : <p>no data</p>}
              </span>
            </div>
          </section>
        </main>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Seo templateTitle='Home' />
        <Seo />

        <main>
          <section className='bg-white'>
            <div className='layout flex flex-col items-center justify-center text-center text-black'>
              <h1 className='mt-8 text-4xl md:text-6xl'>
                Summary of your timeline
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
