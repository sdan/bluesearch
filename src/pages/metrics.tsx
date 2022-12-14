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

  return (
    <Layout>
      <Seo title='Metrics' />
      <MetricsPage session={session} />
    </Layout>
  );
}
