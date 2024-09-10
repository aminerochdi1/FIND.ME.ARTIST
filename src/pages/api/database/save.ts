// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  success: boolean
  message?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.query.token !== "LollLLL") return res.status(401).json({ success: false, message: "No access" })

  const models = require('../../../../models');

  try {
    const jsonData: any = {};

    for (const modelName in models) {
      if (Object.prototype.hasOwnProperty.call(models, modelName)) {
        const Model = require('../../../../models/' + modelName);

        const data = await Model.findAll();

        jsonData[modelName] = data.map((item: any) => item.toJSON());
      }
    }

    const jsonStr = JSON.stringify(jsonData, null, 2);
    res.status(200).json({ success: true, message: jsonStr })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error })
    console.error(error)
  }
}
