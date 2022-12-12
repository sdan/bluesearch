import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();
  const menuItems = [
    {
      href: '/',
      title: 'Dashboard',
    },
    {
      href: '/inactive',
      title: 'Inactive friends',
    },
    {
      href: '/summary',
      title: 'Summarize Timeline',
    },
    {
      href: '/metrics',
      title: 'Public metrics',
    },
    {
      href: '/top_liked',
      title: 'Sort Timeline',
    },
    {
      href: '/quote_tweets',
      title: 'Sort Quote Tweets',
    },
    {
      href: '/following',
      title: 'Search Following',
    },
  ];
  return (
    <>
      <aside className='flex h-screen w-64 bg-gray-200 p-4'>
        {/* <div className='border-b border-gray-200 px-4 py-5 sm:px-6'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>
            Navigation
          </h3>
        </div> */}
        <nav className='px-2 pt-2 pb-4'>
          <ul>
            {menuItems.map(({ href, title }) => (
              <li className='m-2' key={title}>
                <Link href={href}>
                  <div
                    className={`group mt-1 flex items-center rounded-md px-2 py-2 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:outline-none ${
                      router.asPath === href && 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <svg
                      className='mr-3 h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-500'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        stroke-width='2'
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                      />
                    </svg>
                    {title}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* <nav className='px-2 pt-2 pb-4'>
          <a
            href='#'
            className='group flex items-center rounded-md bg-gray-100 px-2 py-2 text-sm font-medium leading-5 text-gray-900 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:outline-none'
          >
            <svg
              className='mr-3 h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
            Dashboard
          </a>
          <a
            href='#'
            className='group mt-1 flex items-center rounded-md px-2 py-2 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:outline-none'
          >
            <svg
              className='mr-3 h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
              />
            </svg>
            Inactive friends
          </a>
          <a
            href='#'
            className='group mt-1 flex items-center rounded-md px-2 py-2 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:outline-none'
          >
            <svg
              className='mr-3 h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
              />
            </svg>
            Summarize Timeline
          </a>

          <a
            href='#'
            className='group mt-1 flex items-center rounded-md px-2 py-2 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:outline-none'
          >
            <svg
              className='mr-3 h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
              />
            </svg>
            Public metrics
          </a>

          <a
            href='#'
            className='group mt-1 flex items-center rounded-md px-2 py-2 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:outline-none'
          >
            <svg
              className='mr-3 h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
              />
            </svg>
            Sort Timeline
          </a>
          <a
            href='#'
            className='group mt-1 flex items-center rounded-md px-2 py-2 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:outline-none'
          >
            <svg
              className='mr-3 h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
              />
            </svg>
            Sort Quote Tweets
          </a>

          <a
            href='#'
            className='group mt-1 flex items-center rounded-md px-2 py-2 text-sm font-medium leading-5 text-gray-600 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:outline-none'
          >
            <svg
              className='mr-3 h-6 w-6 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
              />
            </svg>
            Search following
          </a>
        </nav> */}
      </aside>
    </>
  );
}
