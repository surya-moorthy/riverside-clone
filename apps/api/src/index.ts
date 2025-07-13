import type { Socket } from "socket.io";

import express, { type Request, type Response } from "express";
import multer from "multer";

import http from "http";
import { Server } from "socket.io";
import { CreateBucketCommand, ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
const app = express();
const server = http.createServer(app);
dotenv.config();
const io = new Server(server, {
  cors: { 
     origin: "*" ,
     methods: ["GET", "POST"]
  },
 
});

io.on("connection", (socket : Socket) => {
  console.log("Connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("offer", ({ targetId, offer }) => {
    io.to(targetId).emit("offer", { senderId: socket.id, offer });
  });

  socket.on("answer", ({ targetId, answer }) => {
    io.to(targetId).emit("answer", { senderId: socket.id, answer });
  });

  socket.on("ice-candidate", ({ targetId, candidate }) => {
    io.to(targetId).emit("ice-candidate", { senderId: socket.id, candidate });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});


const upload = multer(); // memory storage for small file uploads

const region = process.env.AWS_S3_REGION as string;
const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY as string;
const endpoint = process.env.AWS_S3_ENDPOINT as string;
const bucketName = process.env.AWS_S3_BUCKET_NAME as string || "recordings";

app.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const { originalname, mimetype, buffer } = req.file;

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    endpoint,
    forcePathStyle: true,
  });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: originalname, // or a dynamic key like `${Date.now()}-${originalname}`
    Body: buffer,
    ContentType: mimetype,
  });

  try {
    const data = await s3Client.send(command);
    console.log("File uploaded successfully:", data);
    res.status(200).json({ message: "File uploaded", key: originalname });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload to S3" });
  }
});


server.listen(3000, () => console.log("Signaling server running on port 3000"));
