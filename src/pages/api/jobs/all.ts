// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const { Job } = require('../../../../models');

export default async function handler(req: any, res: any) {
  try {
    const jobs = await Job.findAll();
    res.status(200).json({ jobs })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal_server_error' });
  }
}
