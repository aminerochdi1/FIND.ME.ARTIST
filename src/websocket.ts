import ServerCore from "./ServerCore";

const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();

// const httpsOptions = {
//   key: fs.readFileSync('C:/Users/Dell/Documents/FIND ME/Find.me-master/src/privkey.pem'),
//   cert: fs.readFileSync('C:/Users/Dell/Documents/FIND ME/Find.me-master/src/fullchain.pem'),
// };
// const server = https.createServer(httpsOptions, app);
const server = https.createServer(app);
const config = require("./config.json");

const corsConfiguration = {
  cors: {
    origin: config.website.substring(0, config.website.length - 1),
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
};
app.use(cors(corsConfiguration));
const io = socketIO(server, corsConfiguration);

console.log(corsConfiguration)

const serverCore = new ServerCore();
serverCore.start();

io.on('connection', (socket:any) => {
  serverCore.connection(socket)
});

server.listen(8081, () => {
  console.log('Serveur socket en cours d\'exécution sur le port 8081');
});