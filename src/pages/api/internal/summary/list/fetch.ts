// Write a handler to return a fetch to https://api.tanager.app/api/internal/top_liked/fetch

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('in internal api');
  console.log('req.body', req.body);
  const { accessToken, listId } = req.body;

  // Fetch from API

  let data = await fetch(
    'https://api.bluesearch.xyz/api/external/summary/list/fetch',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken, listId }),
    }
  );

  data = await data.json();
  console.log('succesfully summary list fetched data', data);

  res.status(200).json(data);
}
