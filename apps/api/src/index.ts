import express from "express"
import { Server } from "socket.io";
import {createServer} from "node:http";
import cors from "cors";
import { create } from "node:domain";
const app = express();
app.use(express.json());


const server = createServer(app);
const io = new Server(server,{
    cors : {
         origin: "http://localhost:5173",
         methods: ["GET", "POST"]
    }
});

io.on('connection',(socket)=>{
    console.log("a user connected");
    socket.on("create-room", ({ user }) => {
    socket.join(user.roomId);
    console.log("user created a room",user.roomId,user)
    socket.to(user.roomId).emit("create-room", {
      user
    });
  });

  socket.on("join-room", ({  user }) => {
  
    console.log("user joined:",user);
    socket.to(user.roomId).emit("user-joined", { user });
  });

  socket.on("offer",(data)=>{
    socket.to(data.roomId).emit("offer",data);
  })

  socket.on("answer",(data)=>{
    socket.to(data.roomId).emit("answer",data);
  })

  socket.on("ice-candidate",(data)=>{
    socket.to(data.roomId).emit("ice-candidate",data);
  })
})

server.listen(3000,()=>{
    console.log("the server is running at port 3000");
})