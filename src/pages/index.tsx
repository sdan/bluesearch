import * as React from 'react';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';

import useSWRMutation from 'swr/mutation';
import { PrismaClient } from '@prisma/client';
import { Tweet } from 'react-static-tweets';

type Props = {
  tweetlist: any[];
};

export default function HomePage({ tweetlist }: Props) {
  console.log('tweetlist front', tweetlist);
  const { data: session } = useSession();

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

  const { trigger } = useSWRMutation(['/api/twitter/fetch'], sendRequest);

  if (!session) {
    return (
      <Layout>
        <Seo templateTitle='Home' />
        <main>
          <section className='bg-white'>
            <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
              <h1 className='drop-shadow-glow animate-flicker text-4xl text-red-500 md:text-6xl'>
                🦅🦅🦅 Tanager 🦅🦅🦅
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
