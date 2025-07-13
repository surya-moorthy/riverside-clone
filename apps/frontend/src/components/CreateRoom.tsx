import { useEffect, useRef, useState} from "react"
import { useNavigate } from "react-router-dom";
import {v4} from "uuid";


export default function CreateRoom() {

  const [username,setUsername] = useState("");
  const navigate = useNavigate();
  const handlecreateroom = (e) =>{
    e.preventDefault();
    const roomId = v4()
    console.log(roomId);
    navigate(`/room/${roomId}`)
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
              <button 
              className='text-white bg-neutral-800 hover:bg-purple-700 px-4 py-2 text-lg rounded-2xl m-4'
              onClick={handlecreateroom}
              >
                    Create a room
              </button>

    </div>
  )
}
    