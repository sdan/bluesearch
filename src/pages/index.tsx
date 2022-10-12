import * as React from 'react';
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { PrismaClient } from '@prisma/client';

import { Client } from 'twitter-api-sdk';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Vercel from '~/svg/Vercel.svg';

export default function HomePage() {
  const { data: session } = useSession();

  // const fetcher: any(data) = (url: any) => fetch(url, {
  //   body: JSON.stringify({ accessToken: data.accessToken }),
  //   headers: { 'Content-Type': 'application/json' },
  //   method: 'POST',
  // } ).then((r) => r.json();

  // const fetcher = async (data: { accessToken: any }) => {
  //   const response = await fetch('/api/twitter', {
  //     body: JSON.stringify({ accessToken: data.accessToken }),
  //     headers: { 'Content-Type': 'application/json' },
  //     method: 'POST',
  //   });
  //   return response.json();
  // };

  async function sendRequest(url: any, { arg }) {
    console.log('access token fetcher', arg.arg);
    return fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ accessToken: arg.arg }),
    });
  }

  // useEffect(() => {
  //   if (!session) {
  //     return;
  //   }

  //   const fetchTwitter = async (data) => {
  //     const response = await fetch('/api/twitter', {
  //       body: JSON.stringify({ accessToken: data.accessToken }),
  //       headers: { 'Content-Type': 'application/json' },
  //       method: 'POST',
  //     });
  //   };

  //   fetchTwitter(session);
  // }, [session]);

  // const fetchTwitter = async (data) => {
  //   const response = await fetch('/api/twitter', {
  //     body: JSON.stringify({ accessToken: data.accessToken }),
  //     headers: { 'Content-Type': 'application/json' },
  //     method: 'POST',
  //   });
  // };

  const { trigger } = useSWRMutation(['/api/twitter'], sendRequest);
  if (!session) {
    return (
      <Layout>
        <Seo templateTitle='Home' />
        <main>
          <section className='bg-white'>
            <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
              <Vercel
                size={60}
                className='drop-shadow-glow animate-flicker text-red-500'
              />
              <h1 className='mt-8 text-4xl md:text-6xl'>Home Page</h1>
              <ButtonLink
                className='mt-4 md:text-lg'
                onClick={() => signIn()}
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
    console.log('session frontend', session);
    return (
      <Layout>
        {/* <Seo templateTitle='Home' /> */}
        <Seo />

        <main>
          <section className='bg-white'>
            <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
              <Vercel className='text-5xl' />
              <h1 className='mt-4'>🦅🦅🦅🦅</h1>
              <p className='mt-2 text-sm text-gray-800'>
                A starter for Next.js, Tailwind CSS, and TypeScript with
                Absolute Import, Seo, Link component, pre-configured with Husky{' '}
              </p>
              <p className='mt-2 text-sm text-gray-700'>
                {/* <ArrowLink href='https://github.com/theodorusclarence/ts-nextjs-tailwind-starter'>
                See the repository
              </ArrowLink> */}
                <>
                  <h2>your username is {session!.user?.name}</h2>

                  <ButtonLink
                    className='mt-6'
                    onClick={() => signOut()}
                    variant='light'
                    href={''}
                  >
                    sign out
                  </ButtonLink>
                  <ButtonLink
                    className='mt-6'
                    onClick={() => trigger({ arg: session.accessToken })}
                    variant='dark'
                    href={''}
                  >
                    fetch tweets
                  </ButtonLink>
                </>
              </p>

              <ButtonLink className='mt-6' href='/components' variant='light'>
                See all components
              </ButtonLink>

              <UnstyledLink
                href='https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftheodorusclarence%2Fts-nextjs-tailwind-starter'
                className='mt-4'
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  width='92'
                  height='32'
                  src='https://vercel.com/button'
                  alt='Deploy with Vercel'
                />
              </UnstyledLink>
            </div>
          </section>
        </main>
      </Layout>
    );
  }
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });
  console.log('index session', session);
  console.log('index session.accessToken', session?.accessToken);
  console.log('index session.twtrId', session?.twtrId);

  if (session && session.twtrId) {
    console.log("session exists and user's twitter id exists");
    const prisma = new PrismaClient();
    const twts = await prisma.tweet.findMany({
      where: {
        userId: session?.twtrId,
      },
    });
    console.log('twts', twts);
  }

  return { props: {} };
}
