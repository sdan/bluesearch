import * as React from 'react';
import { Container, Row, Card, Button } from 'react-bootstrap';
import Sidebar from '@/components/layout/Sidebar';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Link from 'next/link';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronRightIcon,
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';

import {
  Bars3CenterLeftIcon,
  Bars4Icon,
  ClockIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

/* This example requires Tailwind CSS v3.0+ */
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Pricing', href: '#' },
  // { name: '', href: '#' },
];

const projects = [
  {
    id: 1,
    title: 'GraphQL API',
    initials: 'GA',
    team: 'Engineering',
    members: [
      {
        name: 'Dries Vincent',
        handle: 'driesvincent',
        imageUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Lindsay Walton',
        handle: 'lindsaywalton',
        imageUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Courtney Henry',
        handle: 'courtneyhenry',
        imageUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      {
        name: 'Tom Cook',
        handle: 'tomcook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    ],
    totalMembers: 12,
    lastUpdated: 'March 17, 2020',
    pinned: true,
    bgColorClass: 'bg-pink-600',
  },
  // More projects...
];
const pinnedProjects = projects.filter((project) => project.pinned);

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function HomePage() {
  const { data: session } = useSession();
  console.log('SESS frontend', session);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  console.log('SESS hello', process.env.HELLO);
  // A colorful frontend that lets user sign in with Twitter. The frontend contains copy that explains the purpose of the app. It should be clear to the user what they are signing up for. The frontend should also contain a button that lets the user sign in with Twitter. The button should be styled to match the rest of the frontend. The frontend should be responsive and work well on mobile devices.
  // If the user is signed in, the frontend should display their Twitter handle and profile image. It should also contain a button that lets the user sign out. The button should be styled to match the rest of the frontend. The frontend should be responsive and work well on mobile devices.
  // The frontend uses Tailwind

  // If user is not signed in, show landing page
  if (!session) {
    return (
      <div className='isolate bg-white'>
        <div className='absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]'>
          <svg
            className='relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]'
            viewBox='0 0 1155 678'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill='url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)'
              fillOpacity='.3'
              d='M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z'
            />
            <defs>
              <linearGradient
                id='45de2b6b-92d5-4d68-a6a0-9b9b2abad533'
                x1='1154.5'
                y1='678'
                x2='0'
                y2='0'
                gradientUnits='userSpaceOnUse'
              >
                <stop stopColor='#2563EB' />
                <stop offset='1' stopColor='#3B82F6' />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className='px-6 pt-6 lg:px-8'>
          <div>
            <nav
              className='flex h-9 items-center justify-between'
              aria-label='Global'
            >
              <div className='flex lg:min-w-0 lg:flex-1' aria-label='Global'>
                <a href='#' className='-m-1.5 p-1.5'>
                  <span className='sr-only'>Your Company</span>
                  <img
                    className='h-8'
                    src='/images/front-facing-baby-chick_1f425.png'
                    alt=''
                  />
                </a>
              </div>
              <div className='flex lg:hidden'>
                <button
                  type='button'
                  className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className='sr-only'>Open main menu</span>
                  <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>
              <div className='hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-center lg:gap-x-12'>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className='font-semibold text-gray-900 hover:text-gray-900'
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className='hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-end'>
                <a
                  href='#'
                  onClick={() => signIn('twitter')}
                  className='inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20'
                >
                  Sign in
                </a>
              </div>
            </nav>
            <Dialog as='div' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
              <Dialog.Panel
                focus='true'
                className='fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden'
              >
                <div className='flex h-9 items-center justify-between'>
                  <div className='flex'>
                    <a href='#' className='-m-1.5 p-1.5'>
                      <span className='sr-only'>Your Company</span>
                      <img
                        className='h-8'
                        src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                        alt=''
                      />
                    </a>
                  </div>
                  <div className='flex'>
                    <button
                      type='button'
                      className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className='sr-only'>Close menu</span>
                      <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                    </button>
                  </div>
                </div>
                <div className='mt-6 flow-root'>
                  <div className='-my-6 divide-y divide-gray-500/10'>
                    <div className='space-y-2 py-6'>
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className='-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10'
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className='py-6'>
                      <a
                        href='#'
                        className='-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10'
                      >
                        Log in
                      </a>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </div>
        </div>
        <main>
          <div className='relative px-6 lg:px-8'>
            <div className='mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40'>
              <div>
                {/* <div className='hidden sm:mb-8 sm:flex sm:justify-center'>
                  <div className='relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20'>
                    <span className='text-gray-600'>
                      Announcing our next round of funding.{' '}
                      <a href='#' className='font-semibold text-indigo-600'>
                        <span className='absolute inset-0' aria-hidden='true' />
                        Read more <span aria-hidden='true'>&rarr;</span>
                      </a>
                    </span>
                  </div>
                </div> */}
                <div>
                  <h1 className='text-4xl font-bold tracking-tight sm:text-center sm:text-6xl'>
                    Sift the signal from the noise
                  </h1>
                  <p className='mt-6 text-lg leading-8 text-gray-600 sm:text-center'>
                    BlueSearch is a Twitter client that helps you find the best
                    tweets and users. From searching/summarizing/sorting your
                    timeline to sharing mute/block lists, BlueSearch is the best
                    way to manage your Twitter experience.
                  </p>
                  <div className='mt-8 flex gap-x-4 sm:justify-center'>
                    <a
                      href='#'
                      onClick={() => signIn('twitter')}
                      className='inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700'
                    >
                      Sign in with Twitter
                      <span className='text-indigo-200' aria-hidden='true'>
                        &rarr;
                      </span>
                    </a>
                    <Link
                      href='/metrics'
                      className='inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20'
                    >
                      Watch public metrics
                      <span className='text-gray-400' aria-hidden='true'>
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
                <div className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'>
                  <svg
                    className='relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]'
                    viewBox='0 0 1155 678'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fill='url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)'
                      fillOpacity='.3'
                      d='M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z'
                    />
                    <defs>
                      <linearGradient
                        id='ecb5b0c9-546c-4772-8c71-4d3f06d544bc'
                        x1='0'
                        y1='678'
                        x2='1155'
                        y2='0'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop stopColor='#B794F4' />
                        <stop offset='1' stopColor='#7F53AC' />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } else {
    // Once user is signed in, show their profile image and handle and a nice splash page with a sign out button and buttons to access the app features (top liked tweets, top liked quote tweets)
    // Include lots of copy and nice styling and design
    // Use Tailwind and the design system from the frontend of the app
    // Add text that explains what the app does and why the user should use it
    return (
      <Layout>
        <Seo title='BlueSearch Dashboard' />
        <MainComp props={session} />
      </Layout>
    );
  }
}

function MainComp(session) {
  // Pull inactive users
  //////////////

  function pullMetrics(args: any) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('PT args', args);
      console.log('url', args.url);
    }
    return fetch(args.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        twtrId: args.args.twtrId,
      }),
    }).then((res) => res.json());
  }

  function fetchMetrics(args: any) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('FT args', args);
    }
    return fetch(args[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: args[1].accessToken,
        twtrId: args[1].twtrId,
      }),
    }).then((res) => res.json());
  }

  // auto fetch from db and conditionally fetch/store tweets
  // keep fetching from db

  // initialize variable args as type ApiRequest
  const pullTweetArgs: ApiRequest = {
    accessToken: '',
    twtrId: session?.twtrId,
  };
  if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
    console.log('session?.twtrId', session?.twtrId);
  }

  const { data: metricsData, error: metricsError } = useSWR(
    { url: '/api/twitter/metrics/pull', args: pullTweetArgs },
    pullMetrics
  );
  if (metricsError) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('metricsError', metricsError);
    }
  }
  if (metricsData) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('tweetsFromDB', metricsData[0]);
    }
  } else {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('no data');
    }
  }

  const fetchMetricsArgs: ApiRequest = {
    accessToken: session?.accessToken,
    twtrId: session?.twtrId,
  };

  const {
    data: fetchedTweets,
    trigger,
    isMutating,
    error: fetchedTweetError,
  } = useSWRMutation(
    ['/api/internal/metrics/fetch', fetchMetricsArgs],
    fetchMetrics
  );

  if (fetchedTweetError) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('fetchedTweetError', fetchedTweetError);
    }
  }
  if (fetchedTweets) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('fetchedTweets', fetchedTweets);
    }
  } else {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('no fetchedTweets');
    }
  }

  // if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
  console.log('fetchedTweet Error', fetchedTweetError);
  console.log('fetchedTweets', fetchedTweets);
  // }

  //////////////////

  //Use swr to fetch /api/dashboard/pull to get the latest data

  function pullDashboardStats(args: any) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('PT args', args);
      console.log('url', args.url);
    }
    return fetch(args.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        twtrId: args.args.twtrId,
      }),
    }).then((res) => res.json());
  }

  const pullDashboardStatsArgs: any = {
    accessToken: '',
    twtrId: session?.props.twtrId,
  };
  if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
    console.log('session?.twtrId', session?.props?.twtrId);
  }

  const { data: dashboardStats, error: dashboardError } = useSWR(
    { url: '/api/twitter/dashboard/pull', args: pullDashboardStatsArgs },
    pullDashboardStats
  );
  if (dashboardError) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('dashboardStats error', dashboardStats);
    }
  }
  if (dashboardStats) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('dashboard data', dashboardStats);
    }
  } else {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('no data');
    }
  }

  const stats = [
    { name: 'Followers', stat: dashboardStats?.followers },
    { name: 'Following', stat: dashboardStats?.following },
    { name: 'Tweets', stat: dashboardStats?.tweets },
  ];

  const people = [
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      department: 'Optimization',
      email: 'lindsay.walton@example.com',
      role: 'Member',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    // More people...
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className=''>
      <main className=''>
        {/* Page title & actions */}
        <div className='border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8'>
          <div className='min-w-0 flex-1'>
            <h1 className='text-lg font-medium leading-6 text-gray-900 sm:truncate'>
              Home
            </h1>
          </div>
          <div className='mt-4 flex sm:mt-0 sm:ml-4'>
            <button
              type='button'
              className='sm:order-0 order-1 ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-0'
            >
              Share
            </button>
            <button
              type='button'
              className='order-0 inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:order-1 sm:ml-3'
            >
              Create
            </button>
          </div>
        </div>
        {/* Pinned projects */}
        <div className='mt-6 px-4 sm:px-6 lg:px-8'>
          <div>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>
              Lifetime Metrics
            </h3>
            <dl className='mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3'>
              {stats.map((item) => (
                <div
                  key={item.name}
                  className='overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6'
                >
                  <dt className='truncate text-sm font-medium text-gray-500'>
                    {item.name}
                  </dt>
                  <dd className='mt-1 text-3xl font-semibold tracking-tight text-gray-900'>
                    {item.stat}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Projects list (only on smallest breakpoint) */}
        <div className='mt-10 sm:hidden'>
          <div className='px-4 sm:px-6'>
            <h2 className='text-sm font-medium text-gray-900'>Following</h2>
          </div>
          <ul
            role='list'
            className='mt-3 divide-y divide-gray-100 border-t border-gray-200'
          >
            {projects.map((project) => (
              <li key={project.id}>
                <a
                  href='#'
                  className='group flex items-center justify-between px-4 py-4 hover:bg-gray-50 sm:px-6'
                >
                  <span className='flex items-center space-x-3 truncate'>
                    <span
                      className={classNames(
                        project.bgColorClass,
                        'h-2.5 w-2.5 flex-shrink-0 rounded-full'
                      )}
                      aria-hidden='true'
                    />
                    <span className='truncate text-sm font-medium leading-6'>
                      {project.title}{' '}
                      <span className='truncate font-normal text-gray-500'>
                        in {project.team}
                      </span>
                    </span>
                  </span>
                  <ChevronRightIcon
                    className='ml-4 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                    aria-hidden='true'
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Projects table (small breakpoint and up) */}
        <div className='mt-8 hidden sm:block'>
          <div className='inline-block min-w-full border-b border-gray-200 align-middle'>
            <table className='min-w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'
                  >
                    Name
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    Title
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    Status
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                  >
                    Role
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-200 bg-white'>
                {metricsData ? (
                  metricsData.map((user: any) => (
                    <tr key={user.id}>
                      <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6'>
                        <div className='flex items-center'>
                          <div className='h-10 w-10 flex-shrink-0'>
                            <img
                              className='h-10 w-10 rounded-full'
                              src={user.pfp}
                              alt=''
                            />
                          </div>
                          <div className='ml-4'>
                            <div className='font-medium text-gray-900'>
                              {user.name}
                            </div>
                            <div className='text-gray-500'>{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        <div className='text-gray-900'>{user.followers}</div>
                        <div className='text-gray-500'>{user.following}</div>
                      </td>
                      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                        <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'>
                          Active
                        </span>
                      </td>
                      {/* <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                      {person.role}
                    </td> */}
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
