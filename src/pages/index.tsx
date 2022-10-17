import * as React from 'react';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <Layout>
        <Seo templateTitle='Home' />
        <main>
          <section className='bg-white'>
            <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
              <h1 className='drop-shadow-glow animate-flicker text-4xl text-red-500 md:text-6xl'>
                🐥🐥🐥 🐥🐥🐥
              </h1>
              <br />
              <ButtonLink
                className='mt-4 md:text-lg'
                onClick={() => signIn('twitter')}
                href={''}
              >
                Sign In
              </ButtonLink>
            </div>
          </section>
        </main>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Seo templateTitle='Home' />
        <main>
          <section className='bg-white'>
            <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
              <h1 className='drop-shadow-glow animate-flicker text-4xl text-red-500 md:text-6xl'>
                🐥🐥🐥 🐥🐥🐥
              </h1>
              <br />
              <ButtonLink className='mt-4 md:text-lg' href={'/top_liked'}>
                Top Liked Tweets on Timeline
              </ButtonLink>
              <ButtonLink className='mt-4 md:text-lg' href={'/quote_tweets'}>
                Top Liked Quote Tweets
              </ButtonLink>
            </div>
          </section>
        </main>
      </Layout>
    );
  }
}
