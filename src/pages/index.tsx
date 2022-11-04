import * as React from 'react';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
export default function HomePage() {
  const { data: session } = useSession();
  console.log('SESS hello', process.env.HELLO);
  // A colorful frontend that lets user sign in with Twitter. The frontend contains copy that explains the purpose of the app. It should be clear to the user what they are signing up for. The frontend should also contain a button that lets the user sign in with Twitter. The button should be styled to match the rest of the frontend. The frontend should be responsive and work well on mobile devices.
  // If the user is signed in, the frontend should display their Twitter handle and profile image. It should also contain a button that lets the user sign out. The button should be styled to match the rest of the frontend. The frontend should be responsive and work well on mobile devices.
  // The frontend uses Tailwind

  // If user is not signed in, show sign in button
  if (!session) {
    return (
      <Layout>
        <Seo title='Sign in' />
        <div className='-mt-24 flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2 text-center sm:py-12'>
          <h1 className='text-4xl font-bold'>Sign in with Twitter</h1>
          <p className='mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0'>
            Tanager is a Twitter client that helps you find the best tweets and
            people. Sign in with Twitter to get started.
          </p>
          <div className='mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start'>
            <div className='rounded-md shadow'>
              <button
                onClick={() => signIn('twitter')}
                className='flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg'
              >
                Sign in with Twitter
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  } else {
    // Once user is signed in, show their profile image and handle and a nice splash page with a sign out button and buttons to access the app features (top liked tweets, top liked quote tweets)
    // Include lots of copy and nice styling and design
    // Use Tailwind and the design system from the frontend of the app
    // Add text that explains what the app does and why the user should use it
    return (
      <Layout>
        <Seo title='Hello' />
        <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2 text-center sm:py-12'>
          {/* Include an profile picture of the user */}

          <img
            className='h-24 w-24 rounded-full'
            src={session.user!.image || ''}
            alt=''
          />
          {/* add some padding between image and rest of site */}
          <br></br>

          <h1 className='text-4xl font-bold'>
            Welcome to Tanager, {session.user!.name}!
          </h1>
          <p className='mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0'>
            You can now use the suite of Tanager features to find the best
            tweets and people on Twitter.
          </p>
          <div className='mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start'>
            {/* Include text that shows what each button does */}
            <div className='rounded-md shadow'>
              <ButtonLink
                href='/top_liked'
                className='flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg'
              >
                Top Liked Tweets on your Timeline
              </ButtonLink>
            </div>
            {/* Space between the buttons */}
            <div className='mt-3 sm:mt-0 sm:ml-3'>
              <ButtonLink
                href='/quote_tweets'
                className='flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg'
              >
                Top Liked Quote Tweets
              </ButtonLink>
            </div>
            <div className='mt-3 sm:mt-0 sm:ml-3'>
              <ButtonLink
                href='/engaged'
                className='flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg'
              >
                Most engaged with users
              </ButtonLink>
            </div>
            <div className='mt-3 sm:mt-0 sm:ml-3'>
              <ButtonLink
                href='/summary'
                className='flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg'
              >
                Summary of your timeline
              </ButtonLink>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
