import { Client, auth } from 'twitter-api-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const STATE = 'my-state';

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  console.log('callback authurl', authUrl);

  try {
    const { code, state } = req.query;
    console.log('call code', code);
    console.log('call state', state);
    if (state !== STATE) return res.status(500).send("State isn't matching");
    const bab = await authClient.requestAccessToken(code as string);
    console.log('BBAG', bab);

    const tweets = await client.users.findMyUser();

    console.log('tweets CALLBACK', tweets);

    // res.redirect('/tweets');
  } catch (error) {
    console.log(error);
  }

  // res.status(200).json({ name: 'Bambang' });
}

// https://twitter.com/i/oauth2/authorize?code_challenge_method=s256&state=my-state&client_id=NGhyYlRDNk1rSUZpRHBHQVBocWQ6MTpjaQ&scope=tweet.read%20users.read%20offline.access&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fcallback&code_challenge=BLQCZrFQSb-ZdOZv7cJyW97FqDGVK3-gPsQzVzY0pwg
