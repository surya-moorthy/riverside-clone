import { useEffect, useRef, useState } from "react";

export default function Room() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const handleOpen = async ()=>{
//      const stream = await navigator.mediaDevices.getUserMedia({video : true});
//      if(videoRef.current){
//         videoRef.current.srcObject = stream;
//      }
//   }

 const [streams,setStreams] = useState<MediaStream[]>([]);

 const handleOpen = async () =>{
     try {
        const stream = await navigator.mediaDevices.getUserMedia({video : true})
        setStreams((prev) => [...prev,stream])
     }catch (err){
            console.error("Error while stream attaching:",err);
     }
 }
  return (
    <div>
        <button 
        className="bg-neutral-950 hover:bg-purple-500 text-white hover:text-neutral-100 px-4 py-2 text-lg m-4 rounded-xl transition-colors duration-300 ease-in-out"
        onClick={handleOpen}
        >
           Open camera
        </button>
        {/* <video 
        ref={videoRef}
        autoPlay
        autoFocus 
        ></video>    */}
        <div className="grid grid-cols-3 grid-rows-4">
            {
            streams.map((stream)=>{
              return (
                  <VideoBox stream={stream}/>
              )
            })
        }
        </div>

    </div>
    
  )
}

const VideoBox = ({stream}: {stream : MediaStream})=>{
  const videoRef = useRef<HTMLVideoElement>(null);
  
   useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video 
        ref={videoRef}
        autoPlay
        autoFocus
         width={400}
        height={300}
        className="rounded-xl border-4 border-purple-500" 
        ></video>  
  )
}