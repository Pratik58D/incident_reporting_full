import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import IncidentReport from "./pages/IncidentReport"
import Login from "./components/Login"
import { ToastContainer } from "react-toastify"
import ChatRoom from "./pages/ChatRoom"
import Alternative from "./components/Alternative"
import IncidentChatRoom from "./pages/IncidentChatRoom"
import IncidentChat from "./components/Chat"
// import CurrentIncidents from "./pages/CurrentIncidents"
import IncidentView from "./pages/IncidentView"



const App = () => {
  return (
    <div>
      <ToastContainer  />
      <Routes>
        <Route path="/" element= {<Home />} />
        <Route path="/alternative" element= {<Alternative />} />
        <Route path="/report" element= {< IncidentReport/>} />
        <Route path="/chat" element= {<ChatRoom />} />
        <Route path="/incident-chatroom/:incidentId" element= {<IncidentChatRoom />} />

        <Route path="/ichat" element= {<IncidentChat />} />

        <Route path="/see-map" element={<IncidentView />}/>

        <Route path="/login" element = {<Login/>} />
        <Route path="/signup" element = {<Login/>} />

        <Route path="*" element = {<NotFound />} />
      </Routes>
    

      
    </div>
  )
}

export default App