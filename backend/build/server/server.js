"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
const path = require("path");
const serveStatic = require("serve-static");
const cors = require('cors');
const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3300;
const socketPort = process.env.SOCKET || 9901;
const ROOT_URL = dev ? `http://localhost:${port}` : `http://localhost:${port}`;
var app = express();
var socketServer = app.listen(socketPort);
const ioApp = require('socket.io').listen(socketServer);
const routes = require("./routes/routes");
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    console.log("CORS stuff");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
let frontend = __dirname.replace("back", "front");
frontend = frontend.replace("/build/server", "");
app.use(express.static(frontend));
app.use(routes);
app.get('*', function (req, res, next) {
    console.log("app.get", req.params[0]);
    res.sendFile(req.params[0], { root: frontend });
    console.log("contacts sendFile done: ", path.join(frontend, req.params[0]));
});
console.log("app listening on port ", port);
console.log("express.static: ", frontend);
app.listen(port, (err) => {
    if (err)
        throw err;
    console.log(`> Ready on ${ROOT_URL}`);
});
ioApp.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('my other event', function (data) {
        console.log("other event", data);
    });
});
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