import { useEffect, useRef, useState} from "react"
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const [roomId,setRoomId] = useState("");
    const navigate = useNavigate();

  const JoinRoomRoom = () => {
    navigate(`/room/${roomId}`)
  }
  return (
    <div>
              <input type="text" 
              name='room' 
              placeholder="enter roomId" 
              id="room" 
              className='rounded-lg px-4 p-2 m-2 border-2 border-neutral-600'
              onChange={(event)=>{setRoomId(event.target.value)}}
              />
              <button 
              className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'
              onClick={JoinRoomRoom}
              >
                    Join a room
              </button>

    </div>
  )
}
