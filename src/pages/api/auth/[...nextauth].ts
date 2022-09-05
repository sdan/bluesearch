import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      // clientId: process.env.TWITTER_CLIENT_ID!,
      // clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      clientId: 'NGhyYlRDNk1rSUZpRHBHQVBocWQ6MTpjaQ',
      clientSecret: '4dsAcaedKsev2B_-EFRkyyBDH76uMS_ocQwQ3zyoOaHoaZgGWy',
      version: '2.0',
      // profile(profile) {
      //   console.log('profile', profile);
      //   return {
      //     id: profile.id,
      //     name: profile.name,
      //     image: profile.profile_image_url,
      //   };
      // },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('user', user);
      console.log('account', account);
      console.log('profile', profile);
      console.log('email', email);
      console.log('credentials', credentials);
      return true;
    },
  },
  //     return true;
  //   },
  //   async redirect({ url, baseUrl }) {
  //     console.log('redirect', url);
  //     return baseUrl;
  //   },
  //   async session({ session, token, user }) {
  //     console.log('session', session);
  //     console.log('token', token);
  //     console.log('user', user);

  //     return session;
  //   },
  //   async jwt({ token, user, account, profile, isNewUser }) {
  //     console.log('token', token);
  //     console.log('user', user);
  //     console.log('account', account);
  //     console.log('profile', profile);
  //     console.log('isNewUser', isNewUser);

  //     return token;
  //   },
  // },
});
