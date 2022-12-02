import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import Link from 'next/link';
const unsigned_links = [{ href: '/', label: 'Sign in' }];
const signed_links = [
  { href: '/', label: 'Top liked tweets' },
  { href: '/', label: 'Tok liked quote tweets' },
];

export default function Header() {
  const { data: session } = useSession();
  // console.log('session header', session);
  // Design a header that follows the current design that shows a sign out button if the user is signed in, and a sign in button if the user is signed out.
  // Include a link to Top liked tweets and a link to Top liked quote tweets.
  // The styling should be similar to the current design.
  if (session) {
    return (
      <header className='bg-blue-100'>
        <div className='container mx-auto px-4'>
          <nav className='flex items-center justify-between py-4'>
            <div className='flex items-center'>
              <Link href='/'>
                <a className='text-2xl font-bold text-gray-800'>BlueSearch</a>
              </Link>
            </div>
            <div className='flex items-center'>
              <>
                <Link href='/top_liked'>
                  <a className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'>
                    Top liked tweets
                  </a>
                </Link>
                <Link href='/quote_tweets'>
                  <a className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'>
                    Top liked quote tweets
                  </a>
                </Link>
                <Link href='/engaged'>
                  <a className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'>
                    Most engaged with users
                  </a>
                </Link>
                <Link href='/summary'>
                  <a className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'>
                    Summary of your TL
                  </a>
                </Link>
                <Link href='/summary_list'>
                  <a className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'>
                    Summary of a list
                  </a>
                </Link>
                <Link href='/following'>
                  <a className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'>
                    Smart search through following
                  </a>
                </Link>
                <Link href='/inactive'>
                  <a className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'>
                    Inactive friends
                  </a>
                </Link>
                <button
                  onClick={() => signOut()}
                  className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'
                >
                  Sign out
                </button>
              </>
            </div>
          </nav>
        </div>
      </header>
    );
  } else {
    return (
      <header className='bg-blue-100'>
        <div className='container mx-auto px-4'>
          <nav className='flex items-center justify-between py-4'>
            <div className='flex items-center'>
              <Link href='/'>
                <a className='text-2xl font-bold text-gray-800'>BlueSearch</a>
              </Link>
            </div>
            <div className='flex items-center'>
              <button
                onClick={() => signIn('twitter')}
                className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'
              >
                Sign in
              </button>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}
