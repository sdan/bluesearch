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

  function fetchTimeline(args: any) {
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

  const {
    data: pullSummary,
    trigger: triggerSummary,
    isMutating: mutatingSummary,
    error: errorSummary,
  } = useSWRMutation(
    ['/api/twitter/summary/pull', session?.twtrId],
    sendRequest
  );

  const timelineArgs: ApiRequest = {
    accessToken: session?.accessToken,
    twtrId: session?.twtrId,
  };

  const {
    data: timelineData,
    trigger: timlineTrigger,
    isMutating: timelineMutating,
    error: timelineError,
  } = useSWRMutation(
    ['/api/internal/top_liked/fetch', timelineArgs],
    fetchTimeline
  );

  // Style page with Tailwind CSS that follows the same design as the rest of the site
  // Include a button to "Pull latest timeline" and a button to "Summarize" the timeline
  // Show the summary if it exists and is not empty otherwise show a loading indicator or message that the summary is being generated and an error message if the summary is not found or is empty (i.e. no tweets in the timeline) or if the user is not signed in
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
              <div className='mt-8'>
                <button
                  className='rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700'
                  onClick={() => timlineTrigger()}
                >
                  Pull latest timeline
                </button>
              </div>
              <div className='mt-8'>
                <button
                  className='rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700'
                  onClick={() => triggerSummary()}
                >
                  Summarize
                </button>
              </div>
              <div className='mt-8'>
                <h2 className='mt-8 text-4xl md:text-6xl'>
                  {pullSummary?.summary}
                </h2>
                <p className='mt-4 md:text-lg'>
                  {pullSummary?.summary == '' ? 'No summary yet' : ''}
                </p>
              </div>
              <div className='mt-8'>
                <h2 className='mt-8 text-4xl md:text-6xl'>
                  {mutatingSummary ? 'Loading...' : ''}
                </h2>
              </div>

              <div className='mt-8'>
                <h2 className='mt-8 text-4xl md:text-6xl'>
                  {errorSummary ? 'Error' : ''}
                </h2>
              </div>

              <div className='mt-8'>
                <h2 className='mt-8 text-4xl md:text-6xl'>
                  {timelineError ? 'Error' : ''}
                </h2>
              </div>
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
