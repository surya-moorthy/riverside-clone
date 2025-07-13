import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import {createServer} from "node:http"
import {Server} from "socket.io";
const app = express();
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});



server.listen(3000);

