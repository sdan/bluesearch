import * as React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <>
      <Header></Header>
      <div className='flex'>
        <Sidebar />
        {children}
      </div>
    </>
  );
}
