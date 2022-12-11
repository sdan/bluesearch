import React from 'react';
import ButtonLink from '@/components/links/ButtonLink';

const App = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <HomePage />
    </div>
  );
};

export default App;

// function Header() {
//   return (
//     <div className='flex-shrink-0 bg-gray-900 py-4 px-6'>
//       <div className='flex items-center justify-between'>
//         <h1 className='text-lg font-bold text-white'>My Dashboard</h1>
//         <button className='focus:shadow-outline-blue rounded-lg py-1 px-3 font-bold text-white focus:outline-none active:bg-gray-700'>
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

const Header = () => {
  return (
    <div className='w-full border-b border-gray-200 px-4 py-5 sm:px-6'>
      <h3 className='text-lg font-medium leading-6 text-gray-900'>uiiuhiuh</h3>
    </div>
  );
};

function HomePage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2 text-center sm:py-12'>
      {/* Include an profile picture of the user */}

      <img
        className='h-24 w-24 rounded-full'
        // src={session.user!.image || ''}
        alt=''
      />
      {/* add some padding between image and rest of site */}
      <br></br>

      <h1 className='text-4xl font-bold'>
        {/* Welcome to BlueSearch, {session.user!.name}! */}
      </h1>
      <p className='mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0'>
        You can now use the suite of BlueSearch features to find the best tweets
        and people on Twitter.
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
        <div className='mt-3 sm:mt-0 sm:ml-3'>
          <ButtonLink
            href='/summary'
            className='flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg'
          >
            Summary of a list
          </ButtonLink>
        </div>
        <div className='mt-3 sm:mt-0 sm:ml-3'>
          <ButtonLink
            href='/following'
            className='flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg'
          >
            Smart search through following
          </ButtonLink>
        </div>
        <div className='mt-3 sm:mt-0 sm:ml-3'>
          <ButtonLink
            href='/inactive'
            className='flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg'
          >
            Inactive friends
          </ButtonLink>
        </div>
        <div className='mt-3 sm:mt-0 sm:ml-3'>
          <ButtonLink
            href='/metrics'
            className='flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg'
          >
            Twitter Metrics
          </ButtonLink>
        </div>
      </div>
    </div>
    // <div className='min-h-screen flex-col'>
    //   {/* Dashboard Content */}
    //   <div className='bg-gray-100 py-6 px-6'>
    //     <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
    //       <h2 className='mb-4 text-2xl font-bold text-gray-900'>Overview</h2>
    //       <div className='mb-4 flex items-center'>
    //         <div className='mr-4 h-8 w-8 flex-shrink-0 rounded-full bg-gray-500'></div>
    //         <div className='flex-1'>
    //           <h3 className='mb-1 text-xl font-bold text-gray-900'>
    //             Total Sales
    //           </h3>
    //           <span className='text-gray-500'>$65,385</span>
    //         </div>
    //       </div>
    //       <div className='mb-4 flex items-center'>
    //         <div className='mr-4 h-8 w-8 flex-shrink-0 rounded-full bg-gray-500'></div>
    //         <div className='flex-1'>
    //           <h3 className='mb-1 text-xl font-bold text-gray-900'>
    //             Total Orders
    //           </h3>
    //           <span className='text-gray-500'>1,235</span>
    //         </div>
    //       </div>
    //       <div className='mb-4 flex items-center'>
    //         <div className='mr-4 h-8 w-8 flex-shrink-0 rounded-full bg-gray-500'></div>
    //         <div className='flex-1'>
    //           <h3 className='mb-1 text-xl font-bold text-gray-900'>
    //             Total Customers
    //           </h3>
    //           <span className='text-gray-500'>1,235</span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

// Here is a sidebar React component that you can use in your Next.js app. It is based on the Tailwind CSS sidebar component from the Tailwind UI library.

const Sidebar = () => {
  return (
    <aside className='h-screen w-64 bg-gray-200 p-4'>
      {/* <div className='border-b border-gray-200 px-4 py-5 sm:px-6'>
        <h3 className='text-lg font-medium leading-6 text-gray-900'>
          Navigation
        </h3>
      </div> */}
      <nav className='px-2 pt-2 pb-4'>
        <Header />
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
          Projects
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
          Calendar
        </a>
      </nav>
    </aside>
  );
};

function OldSidebar() {
  return (
    <div className=''>
      <h1 className='mb-2 text-2xl font-bold'>Sidebar</h1>
      <ul>
        <li className='mb-2'>
          <a href='#' className='text-blue-600 hover:text-blue-800'>
            Link 1
          </a>
        </li>
        <li className='mb-2'>
          <a href='#' class='text-blue-600 hover:text-blue-800'>
            Link 2
          </a>
        </li>
        <li className='mb-2'>
          <a href='#' class='text-blue-600 hover:text-blue-800'>
            Link 3
          </a>
        </li>
      </ul>
      <button className='mt-4 rounded-full bg-blue-600 py-2 px-4 font-bold text-white'>
        Button
      </button>
    </div>
  );
}
