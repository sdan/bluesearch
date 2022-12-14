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

import { MetricsPage } from '@/components/Metrics';

Chart.register(...registerables);

type Props = {
  tweetlist: any[];
};

import { navigation } from '@/components/layout/Layout';

export default function HomePage() {
  const { data: session } = useSession();
  // All navigation array elements are false by default
  navigation.map((item) => (item.current = false));
  navigation[2].current = true;

  if (!session) {
    return (
      <Layout>
        <Seo title='Metrics' />
        <div className='flex min-h-screen flex-col items-center justify-center py-2'>
          <p className='mt-4 text-xl text-gray-500'>
            You must be signed in to view this page.
          </p>
          <br></br>
          <a
            href='#'
            onClick={() => signIn('twitter')}
            className='inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700'
          >
            Sign in with Twitter
            <span className='text-indigo-200' aria-hidden='true'>
              &rarr;
            </span>
          </a>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Seo title='Metrics' />
        <MetricsPage session={session} />
      </Layout>
    );
  }
}
