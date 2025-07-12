import express from "express"
import { Server } from "socket.io";
import {createServer} from "node:http";
import cors from "cors";
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
})

server.listen(3000,()=>{
    console.log("the server is running at port 3000");
})