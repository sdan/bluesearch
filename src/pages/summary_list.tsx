import * as React from 'react';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';

import useSWRMutation from 'swr/mutation';
import useSWRImmutable from 'swr/immutable';
import { PrismaClient } from '@prisma/client';
import { Tweet } from 'react-static-tweets';
import Parser from 'html-react-parser';

type Props = {
  tweetlist: any[];
};

export default function HomePage() {
  const { data: session } = useSession();
  const [inputListId, setInputListId] = React.useState('');

  const [userError, setUserError] = React.useState('');

  async function sendRequest(args: any) {
    console.log('sendRequest args', args);
    console.log('fetching list timeline');

    timlineTrigger();

    const listLink = args[1];
    // get the last element of url without the query string
    const lastItem = listLink.substring(listLink.lastIndexOf('/') + 1);
    const cleanId = lastItem.split('?')[0];
    console.log('cleanId summary pull', cleanId);

    args[1] = cleanId;

    console.log('PT args clean', args);

    const res = await fetch(args[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listId: args[1],
      }),
    });

    if (!res.ok) {
      const err = new Error('Summary response was not ok');
      err.info = await res.json();
      console.log('erro info', err.info);
      err.status = res.status;
      console.log('SUMMARY ERROR', err);
      throw err;
    }
    return res.json();
  }

  async function fetchTimeline(args: any) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('FT args 2', args);
    }

    const listLink = args[1].listId;
    // get the last element of url without the query string
    const lastItem = listLink.substring(listLink.lastIndexOf('/') + 1);
    const cleanId = lastItem.split('?')[0];
    console.log('cleanId', cleanId);

    args[1].listId = cleanId;

    console.log('FT args clean', args);

    return await fetch(args[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: args[1].accessToken,
        listId: args[1].listId,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const err = new Error('Timeline response was not ok');
        err.info = await res.json();
        err.status = res.status;
        console.log('SUMMARY ERROR', err);
        throw err;
      }
      return res.json();
    });
  }

  const {
    data: pullSummary,
    trigger: triggerSummary,
    isMutating: mutatingSummary,
    error: errorSummary,
  } = useSWRMutation(
    ['/api/twitter/summary/list/pull', inputListId],
    sendRequest
  );

  const timelineArgs: ApiRequest = {
    accessToken: session?.accessToken,
    listId: inputListId,
  };

  const {
    data: timelineData,
    trigger: timlineTrigger,
    isMutating: timelineMutating,
    error: timelineError,
  } = useSWRMutation(
    ['/api/internal/summary/list/fetch', timelineArgs],
    fetchTimeline
  );

  // Style page with Tailwind CSS that follows the same design as the rest of the site
  // Include a button to "Pull latest timeline" and a button to "Summarize" the timeline
  // Show the summary if it exists and is not empty otherwise show a loading indicator or message that the summary is being generated and an error message if the summary is not found or is empty (i.e. no tweets in the timeline) or if the user is not signed in
  // Include a button to submit the list you want to summarize
  if (session) {
    return (
      <Layout>
        <Seo templateTitle='List Summary' />
        <Seo />

        <main>
          <section className='bg-white'>
            <div className='layout flex flex-col items-center justify-center text-center text-black'>
              <h1 className='mt-8 text-4xl md:text-6xl'>
                Summary of your list
              </h1>
              <p className='mt-4 md:text-lg'>
                This page shows a summary of your selected list
              </p>
              {/* // Input field to input the list links */}

              <div className='mt-8 flex w-full flex-col items-center justify-center md:w-1/2'>
                <div className='mt-4 flex w-full flex-col'>
                  <input
                    id='list-link'
                    name='list-link'
                    type='text'
                    className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                    placeholder='Enter a list link: https://twitter.com/i/lists/...'
                    value={inputListId}
                    onChange={(e) => setInputListId(e.target.value)}
                  />
                </div>
              </div>

              <div className='mt-8'>
                <ButtonLink
                  href='/summary_list'
                  className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
                  onClick={() => triggerSummary(inputListId)}
                >
                  Summarize
                </ButtonLink>
              </div>

              <div className='mt-8'>
                <h4 className='text-1xl mt-8 md:text-2xl'>
                  <div
                    dangerouslySetInnerHTML={{ __html: pullSummary?.summary }}
                    style={{ whiteSpace: 'pre-line' }}
                  />
                </h4>
                <p className='mt-4 md:text-lg'>
                  {pullSummary?.summary == '' ? 'No summary yet' : ''}
                </p>
              </div>
              <div className='mt-8'>
                <h2 className='mt-8 text-4xl md:text-6xl'>
                  {mutatingSummary ? 'Summarizing...' : ''}
                </h2>
              </div>
              <div className='mt-8'>
                <h2 className='mt-8 text-4xl md:text-6xl'>
                  {timelineMutating ? 'Fetching timeline...' : ''}
                </h2>
              </div>
              <div className='mt-8'>
                <h2 className='mt-4 text-red-500 md:text-lg'>
                  {errorSummary
                    ? 'Summary error \n' +
                      errorSummary.status +
                      '\n' +
                      errorSummary.info
                    : ''}
                </h2>
              </div>

              <div className='mt-8'>
                <h2 className='mt-4 text-red-500 md:text-lg'>
                  {timelineError
                    ? 'Timeline error \n' +
                      timelineError.status +
                      '\n' +
                      timelineError.info
                    : ''}
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
        <Seo templateTitle='Summary of your timeline' />
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
