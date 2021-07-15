var express = require("express");
var http = require("http");
var WebSocketServer = require("websocket").server;
const { v4: uuidv4 } = require("uuid");
const connections = {};
var messages = [];
var app = express();
var server = http.createServer(app);
var wsServer = new WebSocketServer({ httpServer: server });

wsServer.on("request", (request) => {
  const connection = request.accept("echo-protocol", request.origin);
  connection.sendUTF(JSON.stringify(messages));
  connection.on("message", (message) => {
    if (message.type === "utf8") {
      const msg = JSON.parse(message.utf8Data);
      msg.timestamp = Date.now();
      msg.id = uuidv4();
      messages.push(msg);
      Object.values(connections).forEach((connection) => {
        connection.sendUTF(JSON.stringify(msg));
      });
    }
  });
  const id = uuidv4();
  connections[id] = connection;
});

server.listen(8080, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server started on 8080");
});
