import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001");
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
    </div>
  );
};

export default RoomPage;
