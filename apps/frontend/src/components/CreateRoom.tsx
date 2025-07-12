import { useEffect, useRef, useState} from "react"

export default function CreateRoom() {

    const socketRef = useRef<WebSocket>(null);
  
    const [username,setUsername] = useState("");
    const [roomId,setRoomId] = useState("");
  
    useEffect(()=>{
        const socket = new WebSocket("http://localhost:3000");
        socketRef.current = socket;
         socket.onopen = ()=>{
            console.log("we are connected");
       socket.send(JSON.stringify({type  : "identify-as-sender"}))
    }
    },[])

    const handlecreateroom = async (e) => {
        if(!socketRef.current) return;
         e.preventDefault();
          const pc = new RTCPeerConnection();
          const offer = await pc.createOffer();
         await pc.setLocalDescription(offer);
        console.log(offer);
         pc.onicecandidate = (event) =>{
            if(event.candidate){
                    socketRef.current?.send(JSON.stringify({type : "iceCandidate", candidate : event.candidate}))
                }}
            socketRef.current.send(JSON.stringify({type : "create-offer",sdp : pc.localDescription}))
            

            socketRef.current.onmessage = (event) =>{
            const message = JSON.parse(event.data);
            if(message.type === "create-answer"){
                pc.setRemoteDescription(message.sdp)
            }else if(event.type === "iceCandidate"){
                    pc.addIceCandidate(message.candidate)
            }
        }


    const getVideoMedia = await navigator.mediaDevices.getUserMedia({video : true})
    const video = document.createElement('video')
    video.srcObject = getVideoMedia;
    video.play()
    document.body.appendChild(video);
    getVideoMedia.getTracks().forEach((track)=>{
      pc.addTrack(track)
    })
    }

  return (
    <div>
        <input type="text" 
              name='user' 
              placeholder="enter user name" 
              id="user" 
              className='rounded-lg px-4 p-2 m-2 border-2 border-neutral-600'
              onChange={(event)=>{setUsername(event.target.value)}}
              />
              <input type="text" 
              name='room' 
              placeholder="enter roomId" 
              id="room" 
              className='rounded-lg px-4 p-2 m-2 border-2 border-neutral-600'
              onChange={(event)=>{setRoomId(event.target.value)}}
              />
              <button 
              className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'
              onClick={handlecreateroom}
              >
                    Create a room
                   
              </button>
               {username}
                {roomId}
    </div>
  )
}
