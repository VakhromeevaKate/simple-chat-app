"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
function createMessage(content, isBroadcast = false, sender = 'NS') {
    return JSON.stringify(new Message(content, isBroadcast, sender));
}
class Message {
    constructor(content, isBroadcast = false, sender) {
        this.content = content;
        this.isBroadcast = isBroadcast;
        this.sender = sender;
    }
}
exports.Message = Message;
wss.on('connection', (ws) => {
    const extWs = ws;
    extWs.isAlive = true;
    ws.on('pong', () => {
        extWs.isAlive = true;
    });
    //connection is up, let's add a simple simple event
    ws.on('message', (msg) => {
        const message = JSON.parse(msg);
        setTimeout(() => {
            if (message.isBroadcast) {
                //send back the message to the other clients
                wss.clients
                    .forEach(client => {
                    if (client != ws) {
                        client.send(createMessage(message.content, true, message.sender));
                    }
                });
            }
            ws.send(createMessage(`You sent -> ${message.content}`, message.isBroadcast));
        }, 1000);
    });
    //send immediatly a feedback to the incoming connection    
    ws.send(createMessage('Hi there, I am a WebSocket server'));
    ws.on('error', (err) => {
        console.warn(`Client disconnected - reason: ${err}`);
    });
});
setInterval(() => {
    wss.clients.forEach((ws) => {
        const extWs = ws;
        if (!extWs.isAlive)
            return ws.terminate();
        extWs.isAlive = false;
        ws.ping(null, undefined);
    });
}, 10000);
//start our server
const port = process.env.PORT || 8999;
server.listen(port, () => {
    console.log(`Server started on port ${port} :)`);
});
//# sourceMappingURL=server.js.map