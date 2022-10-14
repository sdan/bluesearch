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
import { Tweet } from 'react-static-tweets';

import { Client } from 'twitter-api-sdk';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Vercel from '~/svg/Vercel.svg';

type Props = {
  tweetlist: any[];
};

type Session = {
  accessToken: string;
  twtrId: string;
};

export default function HomePage({ tweetlist }: Props) {
  console.log('tweetlist front', tweetlist);
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
  type ApiRequest = {
    arg: {
      accessToken: any;
      twtrId: any;
    };
  };
  async function sendRequest(url: any, arg: ApiRequest) {
    console.log('access token fetcher', arg);
    console.log('arg.accessToken', arg.arg.accessToken);
    console.log('arg.twtrId', arg.arg.twtrId);
    return fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        accessToken: arg.arg.accessToken,
        twtrId: arg.arg.twtrId,
      }),
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
    // console.log('session frontend', session);
    // console.log('tweetlist frontend', tweetlist);
    return (
      <Layout>
        {/* <Seo templateTitle='Home' /> */}
        <Seo />

        <main>
          <section className='bg-white'>
            <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
              <h1 className='mt-4'>🦅🦅 Tanager 🦅🦅</h1>
              <p className='mt-2 text-sm text-gray-800'>
                Tweets sorted by likes{' '}
              </p>
              <p className='mt-2 text-sm text-gray-700'>
                <>
                  <h2>welcome {session!.user?.name}</h2>

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
                    onClick={() =>
                      trigger({
                        accessToken: session.accessToken!,
                        twtrId: session.twtrId!,
                      })
                    }
                    variant='dark'
                    href={''}
                  >
                    fetch tweets
                  </ButtonLink>
                </>
              </p>

              {tweetlist ? (
                <ul>
                  {tweetlist.map((value: any, index: any) => {
                    // return <li key={index}>{value.id}</li>;
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
              ) : (
                <p>no tweets</p>
              )}
            </div>
          </section>
        </main>
      </Layout>
    );
  }
}

export async function getServerSideProps({ req, res }: any) {
  const session = await getSession({ req });
  console.log('index session', session);
  console.log('index session.accessToken', session?.accessToken);
  console.log('index session.twtrId', session?.twtrId);
  let tweetlist: any = [];
  if (session && session.twtrId) {
    console.log("session exists and user's twitter id exists");
    const prisma = new PrismaClient();
    // tweetlist = await prisma.tweet.findMany({
    //   orderBy: {
    //     likes: 'desc',
    //   },
    //   where: {
    //     userId: session?.twtrId,
    //   },
    // });

    //find tweets by user id and sort by likes in descending order (most likes first) for the past 24 hours
    tweetlist = await prisma.tweet.findMany({
      orderBy: {
        likes: 'desc',
      },
      where: {
        userId: session?.twtrId,
        createdAt: {
          gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        },
      },
    });
  }
  console.log('twts', tweetlist);

  return {
    props: { tweetlist: JSON.parse(JSON.stringify(tweetlist)) },
  };
}
