"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
const path = require("path");
const serveStatic = require("serve-static");
const cors = require('cors');
var app = express();
const socketServer = require('http').Server(app);
const ioApp = require('socket.io').listen(socketServer);
const routes = require("./routes/routes");
const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3300;
const ROOT_URL = dev ? `http://localhost:${port}` : `http://localhost:${port}`;
app.use(cors());
app.use(express.json());
const frontend = __dirname.replace("back", "front");
app.use(routes);
app.get('*', function (req, res, next) {
    console.log("app.get", path.join(__dirname, req.params[0]));
    res.sendFile(req.params[0], { root: frontend });
    console.log("contacts sendFile done: ", path.join(frontend, req.params[0]));
});
console.log("app listening on port ", port);
app.listen(port, (err) => {
    if (err)
        throw err;
    console.log(`> Ready on ${ROOT_URL}`);
});
socketServer.listen('9900', () => {
    console.log('socket listening on port 9900');
});
ioApp.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('my other event', function (data) {
        console.log("other event", data);
    });
});
module.exports.sendSomething = function (aoContacts) {
    console.log("sending something: ", JSON.stringify(aoContacts));
    ioApp.emit('news', {
        something: JSON.stringify(aoContacts)
    });
};
exports.default = app;
//# sourceMappingURL=server.js.map