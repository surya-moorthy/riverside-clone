
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { io, Socket } from 'socket.io-client';

function App() {

   const [room,setRoom] = useState("");
   const socketRef = useRef<Socket | null>(null);
   useEffect(()=>{
    const socket = io("http://localhost:3000"); 
    socketRef.current = socket;
    socket.on("connect",()=>{
      console.log("we are connected");
    })

    socket.on("disconnect",()=>{
      console.log("ws disconnected");
    })
 
    return ()=>{
      socket.disconnect()
    }
   },[])

   const handlecreateroom = () => {
     if(!room) {
      alert("please enter the room name");
     }

     socketRef.current?.emit("create-room",room);
   }


   const handlejoinroom = () => {
     if(!room) {
      alert("please enter the room name");
     }

     socketRef.current?.emit("join-room",room);
   }
  return (
    <div>
        <input type="text" 
        name='room' 
        placeholder="enter room name" 
        id="room" 
        className='rounded-lg px-4 p-2 m-2 border-2 border-neutral-600'
        onChange={(event)=>{setRoom(event.target.value)}}
        />
        <button 
        className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'
        onClick={handlecreateroom}
        >
               Create a room
        </button>
        <button 
        className='text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 text-lg rounded-2xl m-4'
        onClick={handlejoinroom}
        >
               Join a room
        </button>
    </div>
  )
}

export default App
