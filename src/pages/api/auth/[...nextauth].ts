import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { Client } from 'twitter-api-sdk';

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
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SI user', user);
      console.log('SI account', account);
      console.log('SI profile', profile);
      return true;
    },
    async jwt({ token, account }) {
      console.log('JWT token', token);
      console.log('JWT account', account);
      if (account) {
        token.accessToken = account.access_token;
        console.log('JWT account.accessToken', token.accessToken);

        // const tClient = new Client(String(token.accessToken));

        // const {
        //   data: { id },
        // } = await tClient.users.findMyUser();

        // console.log('JWT twtrId', id);

        // token.twtrId = id;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log('SS SESSSION', session);
      console.log('SS TTTOOKKKEN', token);
      console.log('SS USER', user);
      const tClient = new Client(String(token.accessToken));
      console.log('SS TOKENACCESS', String(token.accessToken));

      const id = (await tClient.users.findMyUser()).data?.id;
      // const id: any = await tClient.users.findMyUser();

      console.log('SS twtrId', id);

      session.accessToken = token.accessToken;
      session.twtrId = id;
      return session;
    },
  },
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
    // // You can define your own encode/decode functions for signing and encryption
    // async encode() {},
    // async decode() {},
  },
});
