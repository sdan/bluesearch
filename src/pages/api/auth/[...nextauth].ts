// @ts-nocheck
import NextAuth from 'next-auth';
import TwitterProvider from '../../../lib/twitter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { Client } from 'twitter-api-sdk';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: '2.0',
    }),
  ],
  secret: 'IaSarwO/qqCDxVg12h/fWcYlDnqGlSOtI4sUwtwST54=',
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SI user', user);
      console.log('SI account', account);
      // Insert refresh token into database
      const { providerAccountId, access_token, refresh_token } = account;

      // update user profile image
      try {
        const data = await prisma.account.update({
          where: {
            providerAccountId: providerAccountId,
          },
          data: {
            access_token: access_token,
            refresh_token: refresh_token,
          },
        });
        console.log('SI data', data);
      } catch (err) {
        console.log(
          'updating account not possible. account probably does not exist: ',
          err
        );
      }

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        console.log('JWT account.accessToken', token.accessToken);
      }
      return token;
    },
    async session({ session, token, user }) {
      const tClient = new Client(String(token.accessToken));
      console.log('SS TOKENACCESS', String(token.accessToken));

      const tUser = (await tClient.users.findMyUser()).data;

      const id = tUser.id;
      const pfp = tUser.profile_image_url;
      const username = tUser.username;

      console.log('SS twtrId', id);

      session.accessToken = token.accessToken;
      session.twtrId = id;
      session.username = username;
      session.pfp = pfp;

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
