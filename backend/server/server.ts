var express = require ('express');
//import { nextTick } from "q";
const path = require ("path");
const serveStatic = require ("serve-static");
const cors = require ('cors');
const dev = process.env.NODE_ENV !== 'production';
//const dev = false;
const port = process.env.PORT || 3300;
const socketPort = process.env.SOCKET || 9901;
const ROOT_URL = dev ? `http://localhost:${port}` : `http://localhost:${port}`;

var app = express();
//const socketServer = require ('http').Server (app);
var socketServer = app.listen(socketPort);
const ioApp = require('socket.io').listen(socketServer);
//ioApp.origins ('*:*');
//ioApp.set('origins', 'http://tobycontacts.ddns.net');
//ioApp.set('origins', 'http://localhost:3300');
//var ioApp = require('socket.io')(socketServer, { origins: '*:*'});
  // socketServer.listen (socketPort, () => {
  //   console.log (`socket listening on port ${socketPort}`);
  // })

// const server = http.createServer(app);
// const sio = require("socket.io")(server, {
//   handlePreflightRequest: (req: any, res: any) => {
//       const headers = {
//           "Access-Control-Allow-Headers": "Content-Type, Authorization",
//           "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
//           "Access-Control-Allow-Credentials": true
//       };
//       res.writeHead(200, headers);
//       res.end();
//   }
// });

const routes: object = require("./routes/routes");
//import { IncomingMessage } from 'http';

app.use(cors());
//app.options('*', cors());
app.use(express.json());
app.use(function (req: any, res: any, next: any) {
  console.log ("CORS stuff");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let frontend: string = __dirname.replace ("back", "front");
frontend = frontend.replace ("/build/server", "");
//const frontend: string = __dirname;
app.use(express.static(frontend));
//console.log ('__dirname', __dirname, 'frontend: ', frontend);
//console.log ("path.join(frontend)", path.join(frontend));
//app.use(express.static(path.join(frontend)));
app.use(routes);
//  console.log("serve static: ", path.join(__dirname, 'public'));
//  app.use(serveStatic(path.join(__dirname, 'public')));
app.get('*', function (req: any, res: any, next: any) {
  console.log ("app.get", req.params[0]);
  //    console.log ("app.get", path.join(frontend, req.params[0]));
  //    console.log("sendFile: ", path.resolve("..", "frontend", "build", req.params[0]));
  //    res.sendFile(path.resolve("..", "frontend", "build", req.params[0]));
  //    res.sendFile(path.join(__dirname, 'frontend/build', req.params[0]));
  res.sendFile (req.params[0], {root: frontend});
  console.log("contacts sendFile done: ", path.join(frontend, req.params[0]));
  //    res.sendFile (req.params[0]);
  //    console.log("contacts sendFile done: ", req.params[0]);
});
// starting express app
//let socketapp = app.listen(port);
//  io = require('socket.io').listen(socketapp);

//console.log ("io: ", io);
console.log("app listening on port ", port);
console.log ("express.static: ", frontend);
  app.listen(port, (err: any) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  });



ioApp.on('connection', function (socket: any) {
  console.log('a user connected');
  socket.on('my other event', function (data: any) {
    console.log("other event", data);
  });
});

module.exports.sendSomething = function (aoContacts: [{}]) {
  //console.log ("sending something: ", JSON.stringify (aoContacts));
  ioApp.emit('news', {
    something: JSON.stringify (aoContacts)
  });
}

module.exports.sendProgress = function (value: string) {
  ioApp.emit ('progress', {
    progress: value
  });
}

export default app;
