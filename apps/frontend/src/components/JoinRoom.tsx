import { useEffect, useRef, useState} from "react"
import { useNavigate } from "react-router-dom";

const RoomNumber = () => {
    
}


export default function JoinRoom() {

  const [username,setUsername] = useState("");
  const [roomId,setRoomId] = useState("");
  const roomIdRef = useRef(""); 
  const [isCreated,SetisCreated] = useState(false);

  const handlecreateroom = (e :  React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    if(!roomId) alert("Enter room Id");
    roomIdRef.current = roomId;
    SetisCreated(true);
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
                    Join a room
              </button>

              {
                isCreated && (
                  <HandleJoin roomId={roomId} username={username}/>
                )
              }

    </div>
  )
}


const HandleJoin = ({roomId , username} : {roomId : string,username : string}) => {
  const [Camera, setCamera] = useState(true);
  const [Audio, setAudio] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: Camera, audio: Audio });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing media devices", err);
    }
  };

  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
  }

  startStream();

  return () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };
}, [Camera, Audio]);


  const handleExit = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      navigate("/"); // or any other route
  }

    const handleRoomJoin = ()=>{
      if (!roomId || !username) {
        alert("Missing room info");
        return;
      }
      navigate(`/room/${roomId}`, { state: { username } });

    }
  return (
    <div className=" flex flex-col justify-center items-center mt-24 max-w-screen">
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: 640 }} />
      <div className="flex  justify-center items-center gap-3 ">
           <button
           className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'
           onClick={()=>{setAudio(!Audio)}}
           >
              audio
           </button>
           <button
           className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'
             onClick={(e)=>{
              e.preventDefault()
              setCamera(!Camera)
            }}
           >
            camera
           </button>
           <button
           className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'
           onClick={handleExit}
           >
                 exit
           </button>
      </div>
      <button 
      className="w-3xs text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4"
      onClick={handleRoomJoin}
      >
           Join the Room
      </button>
    </div>
  );
};












































































// onst socketRef = useRef<WebSocket>(null);
  
//     const [username,setUsername] = useState("");
//     const [roomId,setRoomId] = useState("");
  
//     useEffect(()=>{
//         const socket = new WebSocket("http://localhost:3000");
//         socketRef.current = socket;
//          socket.onopen = ()=>{
//             console.log("we are connected");
//        socket.send(JSON.stringify({type  : "identify-as-sender"}))
//     }
//     },[])

//     const handlecreateroom = async (e) => {
//         if(!socketRef.current) return;
//          e.preventDefault();
//           const pc = new RTCPeerConnection();
//           const offer = await pc.createOffer();
//          await pc.setLocalDescription(offer);
//         console.log(offer);
//          pc.onicecandidate = (event) =>{
//             if(event.candidate){
//                     socketRef.current?.send(JSON.stringify({type : "iceCandidate", candidate : event.candidate}))
//                 }}
//             socketRef.current.send(JSON.stringify({type : "create-offer",sdp : pc.localDescription}))
            

//             socketRef.current.onmessage = (event) =>{
//             const message = JSON.parse(event.data);
//             if(message.type === "create-answer"){
//                 pc.setRemoteDescription(message.sdp)
//             }else if(event.type === "iceCandidate"){
//                     pc.addIceCandidate(message.candidate)
//             }
//         }


//     const getVideoMedia = await navigator.mediaDevices.getUserMedia({video : true})
//     const video = document.createElement('video')
//     video.srcObject = getVideoMedia;
//     video.play()
//     document.body.appendChild(video);
//     getVideoMedia.getTracks().forEach((track)=>{
//       pc.addTrack(track)
//     })
//     }