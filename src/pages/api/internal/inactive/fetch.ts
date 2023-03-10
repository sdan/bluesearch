import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('in internal api');
  console.log('req.body', req.body);
  const { accessToken, twtrId } = req.body;

  // Fetch from API

  console.log(
    'frontend calling API to run long running tasks, accessToken/twtrId:',
    accessToken,
    twtrId
  );

  let data = await fetch(
    // 'https://api.bluesearch.xyz/api/external/inactive/fetch',
    'http://localhost:3001/api/external/inactive/fetch',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken, twtrId }),
    }
  );

  data = await data.json();
  console.log('succesfully following list fetched data', data);

  res.status(200).json(data);
}
