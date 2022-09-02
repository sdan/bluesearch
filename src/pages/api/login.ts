import { Client, auth } from 'twitter-api-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from '../../utils/cookies';

const STATE = 'my-state';

export default function login(req: NextApiRequest, res: NextApiResponse) {
  const authClient = new auth.OAuth2User({
    client_id: 'NGhyYlRDNk1rSUZpRHBHQVBocWQ6MTpjaQ',
    client_secret: 'gFoy-RJdErRNShKD9tPqsvZpLAIWukPXxCaZ9liswAYu6BVwUq',
    callback: 'http://localhost:3000/api/callback',
    scopes: ['tweet.read', 'users.read', 'offline.access'],
  });

  const client = new Client(authClient);

  const authUrl = authClient.generateAuthURL({
    code_challenge_method: 'plain',
    code_challenge: 'test',
    state: STATE,
  });

  // const codeGen = authUrl.slice(-43);

  // console.log('coooookies', codeGen);

  // setCookie(res, 'code_generation', codeGen);

  console.log('authURL', authUrl);

  res.redirect(authUrl);

  // res.status(200).json({ name: 'Bambang' });
}
