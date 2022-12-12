import * as React from 'react';
import { Container, Row, Card, Button } from 'react-bootstrap';
import Sidebar from '@/components/layout/Sidebar';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import { Session } from 'next-auth';
export default function HomePage() {
  const { data: session } = useSession();
  console.log('SESS hello', process.env.HELLO);
  // A colorful frontend that lets user sign in with Twitter. The frontend contains copy that explains the purpose of the app. It should be clear to the user what they are signing up for. The frontend should also contain a button that lets the user sign in with Twitter. The button should be styled to match the rest of the frontend. The frontend should be responsive and work well on mobile devices.
  // If the user is signed in, the frontend should display their Twitter handle and profile image. It should also contain a button that lets the user sign out. The button should be styled to match the rest of the frontend. The frontend should be responsive and work well on mobile devices.
  // The frontend uses Tailwind

  // If user is not signed in, show sign in button
  if (!session) {
    return (
      <div className='gradient flex h-screen items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400'>
        <div className='text-center text-white'>
          <h1 className='mb-2 text-4xl font-bold'>BlueSearch</h1>
          <h3 className='text-md mb-8'>
            A Twitter client that helps you find the best tweets and people.
            Sign in with Twitter to get started.
          </h3>
          <button
            onClick={() => signIn('twitter')}
            className='rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700'
          >
            Sign in with Twitter
          </button>
        </div>
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
        <Dashboard />
      </Layout>
    );
  }
}

//Write a site that explains to the user that the page is currently under construction

function Dashboard() {
  return (
    <>
      <Container className='mt-4'>
        <Row>
          <Card>
            <h1 className='text-4xl font-bold'>Dashboard</h1>

            <Card.Header>Dashboard</Card.Header>
            <Card.Body>
              <Card.Title>Under construction</Card.Title>
              <Card.Text>
                This page is currently under construction. Please check back
                later.
              </Card.Text>
              <ButtonLink href='/'>Go back</ButtonLink>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </>
  );
}
