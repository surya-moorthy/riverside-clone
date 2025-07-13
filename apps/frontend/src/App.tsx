import { Route, Routes } from "react-router-dom";
import { Providers } from "./Providers";
import Home from "./components/Home";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import Room from "./pages/Room";


function App(){
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/createroom" element={<CreateRoom/>}/>
        <Route path="/joinroom" element={<JoinRoom/>}/>
        <Route path="/room/:id" element={<Room/>}/>
      </Routes>
    </Providers>
  )
}

export default App;