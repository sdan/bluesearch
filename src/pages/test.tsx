import React from 'react';

export default function HomePage() {
  return (
    <div className='flex min-h-screen flex-col'>
      {/* Dashboard Header */}
      <div className='flex-shrink-0 bg-gray-900 py-4 px-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-lg font-bold text-white'>My Dashboard</h1>
          <button className='focus:shadow-outline-blue rounded-lg py-1 px-3 font-bold text-white focus:outline-none active:bg-gray-700'>
            Logout
          </button>
        </div>
      </div>
      <Sidebar />
      {/* Dashboard Content */}
      <div className='flex-1 bg-gray-100 py-6 px-6'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div>
            <h2 className='mb-4 text-2xl font-bold text-gray-900'>Overview</h2>
            <div className='mb-4 flex items-center'>
              <div className='mr-4 h-8 w-8 flex-shrink-0 rounded-full bg-gray-500'></div>
              <div className='flex-1'>
                <h3 className='mb-1 text-xl font-bold text-gray-900'>
                  Total Sales
                </h3>
                <span className='text-gray-500'>$65,385</span>
              </div>
            </div>
            <div className='mb-4 flex items-center'>
              <div className='mr-4 h-8 w-8 flex-shrink-0 rounded-full bg-gray-500'></div>
              <div className='flex-1'>
                <h3 className='mb-1 text-xl font-bold text-gray-900'>
                  Total Orders
                </h3>
                <span className='text-gray-500'>1,235</span>
              </div>
            </div>
            <div className='mb-4 flex items-center'>
              <div className='mr-4 h-8 w-8 flex-shrink-0 rounded-full bg-gray-500'></div>
              <div className='flex-1'>
                <h3 className='mb-1 text-xl font-bold text-gray-900'>
                  Total Customers
                </h3>
                <span className='text-gray-500'>1,235</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Here is a sidebar React component that you can use in your Next.js app. It is based on the Tailwind CSS sidebar component from the Tailwind UI library.

function Sidebar() {
  return (
    <div className='h-screen w-64 bg-gray-200 p-4'>
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
