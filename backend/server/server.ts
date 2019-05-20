var express = require ('express');
import { nextTick } from "q";
const path = require ("path");
const serveStatic = require ("serve-static");
const cors = require ('cors');

var app = express();
const socketServer = require ('http').Server (app);
const ioApp = require('socket.io').listen(socketServer);

const routes: object = require("./routes/routes");
//import { IncomingMessage } from 'http';

const dev = process.env.NODE_ENV !== 'production';
//const dev = false;
const port = process.env.PORT || 3300;
const ROOT_URL = dev ? `http://localhost:${port}` : `http://localhost:${port}`;
app.use(cors());
app.use(express.json());
//app.use(function (req: any, res: any, next: any) {
//  res.setHeader('Access-Control-Allow-Origin', '*');

  //res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

//app.use(express.static(path.join(__dirname, "frontend/build")));
const frontend: string = __dirname.replace ("back", "front");
//console.log ('__dirname', __dirname, 'frontend: ', frontend);
//console.log ("path.join(frontend)", path.join(frontend));
//app.use(express.static(path.join(frontend)));
app.use(routes);
//  console.log("serve static: ", path.join(__dirname, 'public'));
//  app.use(serveStatic(path.join(__dirname, 'public')));
app.get('*', function (req: any, res: any, next: any) {
    console.log ("app.get", path.join(__dirname, req.params[0]));
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
  app.listen(port, (err: any) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  });

  socketServer.listen ('9900', () => {
    console.log ('socket listening on port 9900');
  })


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
