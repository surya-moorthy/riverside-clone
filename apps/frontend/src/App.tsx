
import { useEffect } from 'react'
import './App.css'
import { io } from 'socket.io-client';

function App() {
   useEffect(()=>{
    const socket = io("http://localhost:3000"); 

    socket.on("connect",()=>{
      console.log("we are connected");
    })

    socket.on("disconnect",()=>{
      console.log("ws disconnected");
    })
 
    return ()=>{
      socket.disconnect()
    }
   })
  return (
    <div>
        Webrtc connect
    </div>
  )
}

export default App
