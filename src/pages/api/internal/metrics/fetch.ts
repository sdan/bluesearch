import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('in internal api');
  console.log('req.body', req.body);
  const { accessToken, twtrId } = req.body;

  // Fetch from API

  let data = await fetch(
    'https://api.bluesearch.xyz/api/external/metrics/fetch',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken, twtrId }),
    }
  );

  data = await data.json();
  console.log('succesfully top liked fetched data', data);

  res.status(200).json(data);
}
