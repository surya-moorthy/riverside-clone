import { useEffect, useRef } from "react"


export default function JoinRoom() {
    const pcRef = useRef<RTCPeerConnection>(null)
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:3000")
        socket.onopen = ()=>{
           socket.send(JSON.stringify({type  : "identify-as-receiver"}))
        }

        socket.onmessage = async (event) =>{
            const message = JSON.parse(event.data);
            if(message.type === "create-offer"){
                  const pc = new RTCPeerConnection();
                  pc.setRemoteDescription(message.sdp);
                  pc.onicecandidate = (event) =>{
                    if(event.candidate){
                       socket.send(JSON.stringify({type : "iceCandidate", candidate : event.candidate}))
                    }
                 }
                  const answer =await pc.createAnswer();
                  await pc.setLocalDescription(answer);
                  pcRef.current = pc;
                  console.log(answer)
                  socket.send(JSON.stringify({type : "create-answer",sdp : answer}))
            }
        }
      },[])

   const handleJoin = async ()=>{
     const getVideoMedia = await navigator.mediaDevices.getUserMedia({video : true})
        const video = document.createElement('video')
        video.srcObject = getVideoMedia;
        video.play()
        document.body.appendChild(video);
        getVideoMedia.getTracks().forEach((track)=>{
        pcRef.current?.addTrack(track)
        })
   }
  return (
    <div>
        <button onClick={handleJoin} className="text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4"
        >
            Join 
        </button>
    </div>
  )
}
