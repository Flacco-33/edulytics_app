// pages/api/get-auth-token.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch('https://eastus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SUBSCRIPTION_KEY || ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch token');
    }

    const token = await response.text();
    res.status(200).json({ token });
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
