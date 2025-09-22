// this is the entry point of caht app

import HazardTypeCard from "@/common/HazardTypeCard"
import { apiUrl } from "@/env";
import axios from "axios";
import { ArrowLeft, CircleAlert, MessageCircle, Users } from "lucide-react"
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

//type of Incident
interface Incident {
  incident_id: string;
  title: string;
  reported_by?: number;
  hazard_id?: string;
  hazard_name: string;
}

const ChatRoom = () => {
    const [incidentData, setIncidentData] = useState<Incident[]>([]);
    const [displayName , setDisplayName] = useState("");
    const [incidentId , setIncidentId] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const getIncident = async () => {
            try {
                const res = await axios.get(`${apiUrl}/incidents/incident-hazard`)
                console.log(res.data.incidentHazard)
                setIncidentData(res.data.incidentHazard)

            } catch (error) {
                console.error(error)
            }
        }
        getIncident();
    }, []);

    //storing name | email | phone temporrarily
    const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setDisplayName(e.target.value);
        localStorage.setItem("displayName" , e.target.value)
    }


// join the chat based on incident ID

    const handleJoinEmergency = ()=>{
        navigate(`/incident-chatroom/${incidentId}`)
    }

    console.log("incident+ hazard :",incidentData);

    return (
        <>
           <nav className="fixed top-0 right-0 left-0 z-50 bg-backgrounds/95 backdrop-blur-sm border-b border-b-gray-300 shadow-lg p-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* desktop menu */}
                    <div className="flex items-center gap-4">
                        <NavLink to="/" className="flex items-center gap-1 text-gray-800">
                            <ArrowLeft size={15} />
                            <h1 className="">Home</h1>
                        </NavLink>
                    </div>
                    {/* logo */}
                    <div className="flex items-center gap-1">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primaryCol text-white">
                            < MessageCircle />
                        </div>
                        <div>
                            <h1 className="hidden sm:flex font-semibold text-xl text-black">Emergency Chat</h1>
                        </div>
                    </div>
                </div>
            </nav>
                   
            <div className="max-w-7xl flex flex-col items-center mt-20 mx-auto p-5">
                <div className="flex justify-center items-center gap-2 py-5">
                    <div className="bg-primaryCol w-14 h-14 flex items-center justify-center rounded-xl text-white">
                        <MessageCircle size={40} />
                    </div>
                    <h1 className="text-2xl font-extrabold">Emergency Chat</h1>
                </div>

                {/* name section */}
                <section className="bg-white rounded-md flex flex-col justify-center px-20 py-10 gap-4  shadow-lg hover:shadow-2xl">
                    <div className="flex gap-2 items-center">
                        <Users />
                        <h2 className="text-lg font-bold">Your Information</h2>
                    </div>
                    <div className="flex flex-col sm:items-center gap-2 sm:flex-row sm:gap-10">
                        <label>Display Name</label>
                        <input
                            type="text"
                            placeholder="enter your name"
                            value={displayName}
                            onChange={handleNameChange}
                            className="flex-1 border border-gray-300 px-3 py-2 bg-gray-50  text-gray-900 text-sm rounded-lg focus:border-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </section>

                {/* section hazard type */}
                <section className="mt-7 px-5 py-5 ">
                    <div className="flex items-center gap-2 mb-5">
                        <CircleAlert size={30} className="text-error" />
                        <h1 className="font-bold text-lg">Hazard Type</h1>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {incidentData.map((incident) => (
                            <HazardTypeCard
                                key={incident.incident_id}
                                title= {incident.title}
                                onClick = {()=> setIncidentId(incident.incident_id)}
                                selected = {incidentId === incident.incident_id}
                            />
                        ))}
                    </div>
                </section>
                <button
                onClick={handleJoinEmergency} 
                className="bg-primaryCol text-white w-full md:w-72 py-3 rounded-md  text-lg font-semibold hover:bg-primary-dark cursor-pointer"
                >
                    Join Emergency Room
                </button>
            </div>
        </>
    )
}

export default ChatRoom;