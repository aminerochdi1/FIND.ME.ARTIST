const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const next = require('next');

// const dev = process.env.NODE_ENV !== 'production';
const dev = process.env.NODE_ENV !== 'development';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/findmeartist.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/findmeartist.com/fullchain.pem'),
};

app.prepare().then(() => {
  const httpsServer = express();
  const httpServer = express();

  // httpServer.use((req, res, next) => {
  //   return res.redirect(301, 'https://www.findmeartist.com' + req.url);
  // });

  // httpsServer.use((req, res, next) => {
  //   if (req.headers.host === 'findmeartist.com') {
  //     return res.redirect(301, 'https://www.findmeartist.com' + req.url);
  //   }
  //   next();
  // });

  httpsServer.all('*', (req, res) => {
    return handle(req, res);
  });

  http.createServer(httpServer).listen(80, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:80');
  });

  https.createServer(httpsOptions, httpsServer).listen(443, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:443');
  });
});
