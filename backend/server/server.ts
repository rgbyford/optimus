var express = require ('express');
//import { nextTick } from "q";
const path = require ("path");
//const serveStatic = require ("serve-static");
const cors = require ('cors');
//const dev = process.env.NODE_ENV !== 'production';
var parseUrl = require('parseurl');
var resolvePath = require('resolve-path');
let dbFns = require ('./models/database');

const dev = false;
//const port = process.env.PORT || 3600;
const port = 3300;
const socketPort = process.env.SOCKET || 9901;
//const ROOT_URL = dev ? `http://localhost:${port}` : `http://tobycontacts.ddns.net:${port}`;

var app = require('express')();
var http = require('http').Server(app);
//var http = require('http');

console.log ("Socket port: ", socketPort);

const routes: object = require("./routes/routes");
//import { IncomingMessage } from 'http';

dbFns.connectFn ();

app.all('*', function (req: any, res: any, next: any) {
  console.log ('rp[0]', req.params[0]);
  console.log('path: ', req.path);
  next(); // pass control to the next handler
});

app.use(cors());
app.use(express.json());
app.use(function (req: any, res: any, next: any) {
  //console.log ("CORS stuff");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

console.log ("__dirname: ", __dirname);
let frontend: string = __dirname.replace ("back", "front");
frontend = frontend.replace ("/build/server", "");
console.log ("frontend: ", frontend);
//const frontend: string = __dirname;
app.use(express.static(frontend));
//app.use(express.static('../frontend/build/static'));
//app.use(express.static('./static'));
//console.log ('__dirname', __dirname, 'frontend: ', frontend);
//console.log ("path.join(frontend)", path.join(frontend));
//app.use(express.static(path.join(frontend)));
app.use(routes);
//  console.log("serve static: ", path.join(__dirname, 'public'));
//  app.use(serveStatic(path.join(__dirname, 'public')));
http.listen (port, (err: any) => {
//http.createServer(function (req: any, res: any) {
//  res.sendFile (fullpath);
  if (err) throw err;
  console.log("> Ready on", port); // eslint-disable-line no-console
//}).listen(3600);
});

app.get('/', function (req: any, res: any, next: any) {
  var pathname = decodeURIComponent(parseUrl(req).pathname);
  var filename = pathname.substr(1);
  var fullpath = resolvePath(frontend, filename);
  console.log ('pathname: ', pathname);
  console.log ('filename: ', filename);
  console.log ('fullpath: ', fullpath);
  console.log ('r.p[0]: ', req.params[0]);
  console.log ('frontend: ', frontend);
  //if (req.params[0] === undefined  || req.params[0] === '/') {
  //  filename = "/index.html";
 // }
  //console.log ("app.get", filename);
  //    console.log ("app.get", path.join(frontend, req.params[0]));
  //    console.log("sendFile: ", path.resolve("..", "frontend", "build", req.params[0]));
  //    res.sendFile(path.resolve("..", "frontend", "build", req.params[0]));
  //    res.sendFile(path.join(__dirname, 'frontend/build', req.params[0]));
  //res.sendFile (filename, {root: frontend});
  //console.log("contacts sendFile done: ", fullpath + filename);
      res.sendFile (req.params[0], {root: frontend});
      console.log("contacts sendFile done: ", req.params[0]);
//  }
});
// starting express app
//let socketapp = app.listen(port);
//  io = require('socket.io').listen(socketapp);
var ioApp = require('socket.io')(http);

ioApp.on('connection', function (socket: any) {
  console.log('a user connected');
  socket.on('my other event', function (data: any) {
    console.log("other event", data);
  });
});

//console.log ("io: ", io);
console.log("app listening on port ", port);
console.log ("express.static: ", frontend);
  //app.listen(port, (err: any) => {


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
