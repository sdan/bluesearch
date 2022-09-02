import * as React from 'react';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

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
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-white'>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
            <Vercel className='text-5xl' />
            <h1 className='mt-4'>hello world</h1>
            <p className='mt-2 text-sm text-gray-800'>
              A starter for Next.js, Tailwind CSS, and TypeScript with Absolute
              Import, Seo, Link component, pre-configured with Husky{' '}
            </p>
            <p className='mt-2 text-sm text-gray-700'>
              {/* <ArrowLink href='https://github.com/theodorusclarence/ts-nextjs-tailwind-starter'>
                See the repository
              </ArrowLink> */}
              <ButtonLink className='mt-6' href='/api/login' variant='light'>
                login
              </ButtonLink>
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

export async function getServerSideProps() {
  // const client = new Client("AAAAAAAAAAAAAAAAAAAAAEJMZAEAAAAAJCXby%2BrefHm2Fj4mK%2FuC6pXBZPY%3DqLig1DuR52eEL4o3G47SkRzc7s2BZd4v1Bh6RAeg9EwmLNkZu9");

  // // // Fetch data from external API
  // // const res = await fetch(`https://.../data`)
  // // const data = await res.json()
  // console.log("ssp")
  // async function main() {
  //   console.log("in main")
  //   const stream = client.tweets.usersIdTimeline("800117847774986240")
  //   for await (const tweet of stream) {
  //     console.log(tweet.data?.toString);
  //   }
  // }
  // main()

  // Pass data to the page via props
  // return { props: { data } }
  return { props: {} };
}
