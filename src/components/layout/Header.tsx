import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
const unsigned_links = [{ href: '/', label: 'Sign in' }];
const signed_links = [
  { href: '/', label: 'Top liked tweets' },
  { href: '/', label: 'Tok liked quote tweets' },
];

export default function Header() {
  const { data: session } = useSession();
  console.log('session header', session);
  // Design a header that follows the current design that shows a sign out button if the user is signed in, and a sign in button if the user is signed out.
  // Include a link to Top liked tweets and a link to Top liked quote tweets.
  // The styling should be similar to the current design.

  return (
    <header className='bg-blue-100'>
      <div className='container mx-auto px-4'>
        <nav className='flex items-center justify-between py-4'>
          <div className='flex items-center'>
            <UnstyledLink href='/'>
              <a className='text-2xl font-bold text-gray-800'>Tanager</a>
            </UnstyledLink>
          </div>
          <div className='flex items-center'>
            {session ? (
              <>
                <UnstyledLink href='/top_liked'>
                  <a className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'>
                    Top liked tweets
                  </a>
                </UnstyledLink>
                <UnstyledLink href='/quote_tweets'>
                  <a className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'>
                    Top liked quote tweets
                  </a>
                </UnstyledLink>
                <button
                  onClick={() => signOut()}
                  className='ml-4 text-gray-800 hover:text-gray-900 hover:underline'
                >
                  Sign out
                </button>
              </>
            ) : (
              <UnstyledLink href='/api/auth/signin'>
                <a className='text-gray-800 hover:text-gray-900 hover:underline'>
                  Sign in
                </a>
              </UnstyledLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
