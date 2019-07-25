"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
const path = require("path");
const cors = require('cors');
var parseUrl = require('parseurl');
var resolvePath = require('resolve-path');
let dbFns = require('./models/database');
let connectionFns = require('./models/connection');
const dev = false;
const port = 3300;
const socketPort = process.env.SOCKET || 9901;
var app = require('express')();
var http = require('http').Server(app);
console.log("Socket port: ", socketPort);
const routes = require("./routes/routes");
var session = require('express-session');
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        yield dbFns.connectFn();
    });
}
connectToDB();
app.all('*', function (req, res, next) {
    console.log('rp[0]', req.params[0]);
    console.log('path: ', req.path);
    next();
});
app.use(routes);
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
console.log("__dirname: ", __dirname);
let frontend = __dirname.replace("back", "front");
frontend = frontend.replace("/build/server", "");
console.log("frontend: ", frontend);
app.use(express.static(frontend));
http.listen(port, (err) => {
    if (err)
        throw err;
    console.log("> Ready on", port);
});
app.get('/', function (req, res, next) {
    var pathname = decodeURIComponent(parseUrl(req).pathname);
    var filename = pathname.substr(1);
    var fullpath = resolvePath(frontend, filename);
    console.log('pathname: ', pathname);
    console.log('filename: ', filename);
    console.log('fullpath: ', fullpath);
    console.log('r.p[0]: ', req.params[0]);
    console.log('frontend: ', frontend);
    res.sendFile(req.params[0], { root: frontend });
    console.log("contacts sendFile done: ", req.params[0]);
});
var ioApp = require('socket.io')(http);
ioApp.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('my other event', function (data) {
        console.log("other event", data);
    });
});
console.log("app listening on port ", port);
console.log("express.static: ", frontend);
module.exports.sendSomething = function (aoContacts) {
    ioApp.emit('news', {
        something: JSON.stringify(aoContacts)
    });
};
module.exports.sendProgress = function (value) {
    ioApp.emit('progress', {
        progress: value
    });
};
exports.default = app;
//# sourceMappingURL=server.js.map