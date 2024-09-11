// import { NextApiRequest, NextApiResponse } from 'next';



// export default function handler(req: NextApiRequest, res: NextApiResponse) {

//   const forwarded = req.headers['x-forwarded-for'];
//   const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket.remoteAddress;

//   res.status(200).json({ip});

// }

import { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ip }));
    
}