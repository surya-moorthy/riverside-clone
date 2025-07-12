
import { useEffect, useRef, useState } from 'react'
import './App.css'
import { io, Socket } from 'socket.io-client';

type user = {
  username : string,
  roomId : string
}

function App() {
   const [username,setUsername] = useState("");
   const [roomId,setRoomId] = useState("");
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
      const user = { username, roomId };
      socketRef.current?.emit("create-room", { user });
   }

   const handlejoinroom = () => {
      const user = { username, roomId };
      socketRef.current?.emit("join-room", { user });
   }
  return (
    <div>
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
        </div>
        <div>
            <input type="text" 
              name='room' 
              placeholder="enter room name" 
              id="room" 
              className='rounded-lg px-4 p-2 m-2 border-2 border-neutral-600'
              onChange={(event)=>{setRoomId(event.target.value)}}
              />
              <button 
              className='text-white bg-purple-700 hover:bg-purple-800 px-4 py-2 text-lg rounded-2xl m-4'
              onClick={handlejoinroom}
              >
                    Join a room
              </button>
        </div>
    </div>
  )
}

export default App
