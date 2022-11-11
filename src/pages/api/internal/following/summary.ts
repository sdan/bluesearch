import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('in internal summary api');
  console.log('req.body', req.body);
  const { query, twtrId } = req.body;

  // Fetch from API

  let data = await fetch(
    'https://api.sparrowsearch.xyz/api/external/following/summary',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, twtrId }),
    }
  );

  data = await data.json();
  console.log('succesfully following list fetched data', data);

  res.status(200).json(data);
}
