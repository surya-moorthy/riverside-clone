import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000");
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [streamStarted, setStreamStarted] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!roomId) return;

      // 1. Join the room
      socket.emit("join_room", roomId);

      // 2. Get local media stream
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideo.current) localVideo.current.srcObject = localStream;

      // 3. Handle new users
      socket.on("user-joined", async (userId: string) => {
        console.log("User joined:", userId);

        peerConnection.current = new RTCPeerConnection(config);
        localStream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, localStream);
        });

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              targetId: userId,
              candidate: event.candidate,
            });
          }
        };

        peerConnection.current.ontrack = (event) => {
          if (remoteVideo.current) {
            remoteVideo.current.srcObject = event.streams[0];
          }
        };

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);

        socket.emit("offer", { targetId: userId, offer });
      });
      
        // On the peer who RECEIVES an offer
        socket.on("offer", async ({ senderId, offer }) => {
        // ✅ Set up the peer connection
        peerConnection.current = new RTCPeerConnection(config);

        // ✅ Add tracks from local stream
        localStream.getTracks().forEach((track) => {
            peerConnection.current?.addTrack(track, localStream);
        });

        // ✅ Handle ICE and remote stream
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
            socket.emit("ice-candidate", {
                targetId: senderId,
                candidate: event.candidate,
            });
            }
        };

        peerConnection.current.ontrack = (event) => {
            if (remoteVideo.current) {
            remoteVideo.current.srcObject = event.streams[0];
            }
        };

        // ✅ Accept the offer and send answer
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        socket.emit("answer", { targetId: senderId, answer });
        });


      socket.on("answer", async ({ answer }) => {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        try {
          await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      });
    };

    if (!streamStarted) {
      init();
      setStreamStarted(true);
    }

    return ()=>{

    }
  }, [roomId, streamStarted]);


  return (
    <div>
      <h2>Room: {roomId}</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        <video ref={localVideo} autoPlay muted style={{ width: 300, border: "1px solid black" }} />
        <video ref={remoteVideo} autoPlay style={{ width: 300, border: "1px solid black" }} />
      </div>
      <Recordings roomId={roomId as string}/>
    </div>
  );
};


const Recordings = ({roomId } : {roomId : string}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob , setRecordedBlob] = useState<Blob | null>(null);
    const [uploading, setUploading] = useState(false);
  const chunks = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const combinedStream = new MediaStream([
      ...screenStream.getVideoTracks(),
      ...micStream.getAudioTracks(),
    ]);

    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm",
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: "video/webm" });
      setRecordedBlob(blob);
      // reset for next recording
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  };

 const stopRecording = () => {
  if (!mediaRecorderRef.current) return;

  mediaRecorderRef.current.onstop = () => {
    const blob = new Blob(chunks.current, { type: "video/webm" });
    setRecordedBlob(blob);

    // Stop all tracks
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());

    // Cleanup
    mediaRecorderRef.current = null;
    chunks.current = [];
    setRecording(false);
  };

  mediaRecorderRef.current.stop();
};

  const startDownloading = () => {
     if (!recordedBlob) return;
     const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();

      chunks.current = [];
  }

  const upload = async () => {
  if (!recordedBlob || !roomId) return;

  const formData = new FormData();
  formData.append("file", recordedBlob, `${roomId}.webm`);
  formData.append("filename", roomId);
  formData.append("filetype", recordedBlob.type);

  try {
    setUploading(true);
    const response = await axios.post("http://localhost:3000/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Upload successful", response.data);
  } catch (err) {
    console.error("Upload failed", err);
  } finally {
    setUploading(false);
  }
};


  return (
    <div>
      <button onClick={startRecording} disabled={recording}  className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}  className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'>
        Stop 
      </button>
       <button onClick={startDownloading} disabled={!recordedBlob}  className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'>
           Download
      </button>
      <button 
        onClick={upload} 
        disabled={!recordedBlob || uploading}  
        className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'
      >
        {uploading ? "Uploading..." : "Upload"}
</button>
    </div>
  );
};

export default RoomPage;
