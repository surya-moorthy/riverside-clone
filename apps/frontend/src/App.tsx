import { Route, Routes } from "react-router-dom";
import { Providers } from "./Providers";
import Home from "./components/Home";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";


function App(){
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/createroom" element={<CreateRoom/>}/>
        <Route path="/joinroom" element={<JoinRoom/>}/>
      </Routes>
    </Providers>
  )
}

export default App;