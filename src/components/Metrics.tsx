import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  ChevronRightIcon,
  ChevronUpDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { ChartData, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale, Legend } from 'chart.js';
Chart.register(CategoryScale);

import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

// Consts
/////////////////////////
const projects = [
  {
    id: 1,
    title: 'doesnt work in mobile correctly',
    initials: '',
    team: '',
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
/////////////////////////
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function MetricsGraphs(props: {
  followerDateArr: any;
  followerArr: any;
  followingDateArr: any;
  followingArr: any;
}) {
  // console.log('PROPS', props);
  // Length of followerDate
  const followerDateArr = props.followerDateArr;
  const followerArr = props.followerArr;
  const followerDateArrLength = followerDateArr?.length;
  const followerArrLength = followerArr?.length;
  // console.log('followerDateArrLength', followerDateArrLength);
  // console.log('followerArrLength', followerArrLength);

  const data = {
    labels: props.followerDateArr,
    datasets: [
      {
        data: props.followerArr,
      },
    ],
  };

  const noLegendOptions: ChartOptions<'line'> = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Line data={data} options={noLegendOptions} width={400} height={100} />
  );
}

export function MetricsPage(props: {
  session: { twtrId: any; accessToken: any };
}) {
  // Pull inactive users
  //////////////

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
  const [pageNumber, setPageNumber] = useState(0);

  const pullMetricsArgs: any = {
    accessToken: '',
    twtrId: props.session?.twtrId,
    page: pageNumber,
  };
  if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
    console.log('session?.twtrId', props.session?.twtrId);
  }

  const { data: metricsData, error: metricsError } = useSWR(
    { url: '/api/twitter/metrics/pull', args: pullMetricsArgs },
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

  function pullMetrics(args: any) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('PT args', args);
      console.log('url', args.url);
    }
    console.log('in pull metrics args.page', args.args.page);
    return fetch(args.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        twtrId: args.args.twtrId,
        page: args.args.page,
      }),
    }).then((res) => res.json());
  }

  const fetchMetricsArgs: any = {
    accessToken: props.session?.accessToken,
    twtrId: props.session?.twtrId,
  };

  const {
    data: fetchedMetrics,
    trigger,
    isMutating,
    error: fetchedMetricsError,
  } = useSWRMutation(
    ['/api/internal/metrics/fetch', fetchMetricsArgs],
    fetchMetrics
  );

  if (fetchedMetricsError) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('fetchedMetricsError', fetchedMetricsError);
    }
  }
  if (fetchedMetrics) {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('fetchedMetrics', fetchedMetrics);
    }
  } else {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
      console.log('no fetched metrics');
    }
  }

  // if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
  console.log('fetchedTweet Error', fetchedMetricsError);
  console.log('fetchedTweets', fetchedMetrics);
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
    twtrId: props.session?.twtrId,
  };
  if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') {
    console.log('session?.twtrId', props.session?.twtrId);
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
              Public Analytics
            </h1>
          </div>
          <div className='mt-4 flex sm:mt-0 sm:ml-4'>
            {/* <button
              type='button'
              className='sm:order-0 order-1 ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-0'
            >
              Share
            </button> */}

            {isMutating ? (
              <>
                <button
                  type='button'
                  onClick={() => {
                    trigger();
                  }}
                  className='order-0 inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:order-1 sm:ml-3'
                >
                  <svg
                    role='status'
                    className='mr-3 inline h-4 w-4 animate-spin text-white'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='#E5E7EB'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentColor'
                    />
                  </svg>
                  Fetching...
                </button>
              </>
            ) : props?.session?.accessToken ? (
              <button
                type='button'
                onClick={() => {
                  trigger();
                }}
                className='order-0 inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:order-1 sm:ml-3'
              >
                Refresh stats
              </button>
            ) : (
              <button
                type='button'
                onClick={() => {
                  signIn('twitter');
                }}
                className='order-0 inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:order-1 sm:ml-3'
              >
                Sign in to refresh stats
              </button>
            )}

            <div className='mt-2 max-w-xl text-sm text-gray-500'>
              <p>
                This is a public analytics page for Twitter. Track
                follower/following/tweet counts over time for public accounts.
              </p>
            </div>
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

        <div className='mt-8 flex flex-col'>
          <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
              <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
                <table className='min-w-full divide-y divide-gray-300'>
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
                        Followers
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Following
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
                      >
                        Graph
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white'>
                    {metricsData ? (
                      metricsData[0].map((user: any) => (
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
                                <div className='text-gray-500'>
                                  {user.username}
                                </div>
                              </div>
                            </div>
                          </td>

                          {user.latestFollowers.length > 1 ? (
                            <>
                              {user.latestFollowers[
                                user.latestFollowers.length - 1
                              ] -
                                user.latestFollowers[0] >
                              0 ? (
                                <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                  {user.followers}
                                  <ArrowUpIcon
                                    className='h-5 w-5 flex-shrink-0 self-center text-green-500'
                                    aria-hidden='true'
                                  />
                                  <p
                                    className={
                                      'ml-2 flex items-baseline text-sm font-semibold text-green-600'
                                    }
                                  >
                                    {user.latestFollowers[
                                      user.latestFollowers.length - 1
                                    ] - user.latestFollowers[0]}
                                  </p>
                                </td>
                              ) : (
                                <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                  {user.followers}
                                  <ArrowDownIcon
                                    className='h-5 w-5 flex-shrink-0 self-center text-red-500'
                                    aria-hidden='true'
                                  />
                                  <p
                                    className={
                                      'ml-2 flex items-baseline text-sm font-semibold text-red-600'
                                    }
                                  >
                                    {user.latestFollowers[
                                      user.latestFollowers.length - 1
                                    ] - user.latestFollowers[0]}
                                  </p>
                                </td>
                              )}
                            </>
                          ) : (
                            <>
                              <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                                {user.followers}
                              </td>
                            </>
                          )}

                          <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                            {user.following}
                          </td>
                          <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                            <MetricsGraphs
                              followerArr={user.latestFollowers}
                              followingArr={user.latestFollowing}
                              followerDateArr={user.fetchedFollowers}
                              followingDateArr={user.fetchedFollowing}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </tbody>
                  <nav
                    className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'
                    aria-label='Pagination'
                  >
                    <div className='hidden sm:block'>
                      <p className='text-sm text-gray-700'>
                        Showing{' '}
                        <span className='font-medium'>{pageNumber * 100}</span>{' '}
                        to{' '}
                        <span className='font-medium'>
                          {pageNumber * 100 + 100}
                        </span>{' '}
                        of{' '}
                        <span className='font-medium'>{metricsData?.[1]}</span>{' '}
                        results
                      </p>
                    </div>
                    <div className='flex flex-1 justify-between sm:justify-end'>
                      <a
                        href='#'
                        onClick={() => {
                          setPageNumber(pageNumber - 1);
                        }}
                        className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                      >
                        Previous
                      </a>
                      <a
                        href='#'
                        onClick={() => {
                          setPageNumber(pageNumber + 1);
                        }}
                        className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                      >
                        Next
                      </a>
                    </div>
                  </nav>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
