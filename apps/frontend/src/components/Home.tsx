import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen gap-2">
         <button 
         className="px-4 py-2 bg-neutral-800 hover:bg-purple-600 transition-colors duration-300 text-white shadow border hover:border-2 rounded-xl"
         onClick={()=>{navigate("/createroom")}}
         >
            Create Room
         </button>
          <button 
          className="px-4 py-2 bg-neutral-800 hover:bg-purple-600 transition-colors duration-300 text-white shadow border hover:border-2 rounded-xl"
          onClick={()=>{navigate("/joinroom")}}
          >
          Join Room 
         </button>
    </div>
  )
}
