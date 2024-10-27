import type { NextApiRequest, NextApiResponse } from 'next';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

type Data = {
  message: string;
  data?: any;
  error?: string;
};

const client = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }
  

  const { idCourse, idTeacher, idStudent, aspect, video_url } = req.body;

  const params = {
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: JSON.stringify({
      idCourse,
      idTeacher,
      idStudent,
      aspect,
      video_url,
    }),
  };

  try {
    const command = new SendMessageCommand(params);
    const data = await client.send(command);
    res.status(200).json({ message: 'Message sent successfully', data });
  } catch (error: any) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
}
