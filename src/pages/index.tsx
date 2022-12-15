import * as React from 'react';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { useState } from 'react';

import { LandingPage, MainPage } from '@/components/Dashboard';

export default function HomePage() {
  const { data: session } = useSession();
  console.log('SESS frontend', session);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!session) {
    return <LandingPage />;
  } else {
    return (
      <Layout>
        <Seo title='BlueSearch Dashboard' />
        <MainPage props={session} />
      </Layout>
    );
  }
}
