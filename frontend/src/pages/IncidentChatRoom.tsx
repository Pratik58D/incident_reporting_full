//This is main chat room 
import ChatFunction from "@/common/ChatFunction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { apiUrl, baseUrl } from "@/env";
import { formatTimeAgo, groupMessagesByDate } from "@/lib/dateutils";
import { extractLocation } from "@/lib/locationutils";
import { getChitChat, postChitchat } from "@/services/chitchatService";
// import socket from "@/services/socket";
import socketServices from "@/services/socket"
import { authStore } from "@/store/authStore";
import { incidentReportStore, type IncidentType } from "@/store/incidentReportStore";
// import userStore from "@/store/userStore";
import axios from "axios";
import { ArrowLeft, Send, Upload } from "lucide-react"
import { observer } from "mobx-react-lite";
import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify";

export interface MessageType {
    incidentId: number;
    userId: number;
    text?: string;
    fileId?: number | null;
    file_name?: string;
    chitchat_id?: number;
    user_name: string,
    log_date: string,
}

const IncidentChatRoom = observer(() => {
    const [incident, setIncident] = useState<IncidentType | null>(null);
    const [location, setLocation] = useState("");
    const navigate = useNavigate();

    const { incidentId } = useParams<{ incidentId: string }>();
    const incidentIdNum = incidentId ? parseInt(incidentId, 10) : undefined;

    const [messages, setMessages] = useState<MessageType[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    // const [filePreview , setFilePreview] = useState<string | null>(null);

    //fetch the single incident detail
    useEffect(() => {
        const fetchSingleIncident = async () => {
            try {
                const res = await axios.get(`${apiUrl}/incidents/incident-hazard/${incidentId}`)
                setIncident(res.data.incidentHazard);
            } catch (error) {
                console.error(error)
            }
        }
        fetchSingleIncident();
    }, [incidentId])

    //fetch existing messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!incidentIdNum) return;
            const data = await getChitChat(incidentIdNum);
            setMessages(data || []);
        };
        fetchMessages();
    }, [incidentIdNum])

    //join the socket room and listen for new messages 
    useEffect(() => {
        const socket = socketServices.get();

        if (!socket) {
            console.error("socket not initialized");
            return;
        }

        if (!incidentIdNum) {
            console.error("NO incindet ID")
            return
        }
        console.log("joining incindet room: ", incidentIdNum)

        // join the incidnet room
        socket.emit("join:incident", { incidentId: incidentIdNum });

        // listen for join confirmation
        socket.on('message:new', (msg: MessageType) => {
            console.log("Received from socket: ", msg);
            setMessages((prev) => [...prev, msg])
        });
        return () => {
            socket.off("message:new");
        }
    }, [incidentIdNum]);

    //handle file input changes
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
            incidentReportStore.setPreview(e.target.files[0])
        }
    }

    const handleSend = async () => {
        if (!newMessage.trim() && !file) return;
        if (!incidentIdNum) return;
        try {
            await postChitchat(incidentIdNum, newMessage, file);
            toast.success("message send")
            setNewMessage("");
            setFile(null);
            incidentReportStore.reset();
        } catch (error) {
            toast.error("Failed to send message");
            console.error(error);
        }
    }

    const groupMessages = groupMessagesByDate(messages);
    const sortedDates = Object.keys(groupMessages).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    // location handling
    useEffect(() => {
        const fetchLocation = async () => {
            if (incident && incident?.latitude && incident?.longitude) {
                const place = await extractLocation(incident.latitude, incident.longitude)
                setLocation(place)
            }
        }
        fetchLocation();
    }, [incident]);

    // handle logout
    const handleLogout = async () => {
        try {
            await authStore.logout();
            incidentReportStore.reset();
            navigate("/")
        } catch (error) {
            console.error("logout failed", error)
            toast.error("Logout failed. Please try again.")

        }
    }

    // console.log("ajgsjagja locaiton is :", location)
    console.log("all messages are:", messages)
    console.log("single incident has: ", incident)

    return (
        <section className="h-screen flex flex-col">
            {/* header section */}
            <header className="flex justify-between items-center border-b border-b-gray-200 shadow-md px-2  md:px-10 py-5 flex-shrink-0">
                <div className="flex items-center gap-5 sm:gap-10">
                    <Link to="/incidents" className="flex items-center gap-1">
                        <ArrowLeft className="w-5 h-5 font-semibold" />
                        <p className="text-md font-medium">Back</p>
                    </Link>
                    <div className="flex gap-2">
                        {/* <h1>logo</h1> */}
                        <h1 className="capitalize font-semibold text-xl">{incident?.title}</h1>
                    </div>
                </div>
                <button className="button-primary" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            {/* main chat section */}
            <main className="flex flex-1 overflow-hidden">
                {/* chat area  */}
                <div className="flex flex-col flex-1 border-r border-gray-200">
                    <section className="py-5">
                        <h1 className="text-center text-2xl font-semibold">Tell us about the incident...</h1>

                    </section>
                    {/* messages chat field this has to be fixed at button */}
                    <section className="flex flex-col px-4 md:px-10 py-3 ">
                        
                        {incidentReportStore.previewUrl && (
                            <img
                                src={incidentReportStore.previewUrl}
                                alt="preview"
                                className="max-w-32 max-h-32 rounded-md mb-2 ml-12"
                            />
                        )} 

                        <div className="flex items-center gap-4">
                             <Avatar  className="border-none shadow-md bg-gray-700 text-white cursor-pointer ">
                                    <AvatarImage src="" />
                                    <AvatarFallback >PD</AvatarFallback>
                                    </Avatar>
                            <div className="flex flex-1 items-center border border-gray-300 rounded-lg px-3 py-2 gap-4 bg-white">
                                {/* file handling */}
                                <div className="">
                                    <input
                                        type="file"
                                        id="chat-file-upload"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="chat-file-upload">
                                        <Upload className="w-5 h-5 font-semibold" />
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                               <button
                                className="bg-primaryCol text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-800"
                                onClick={handleSend}
                            >
                                <Send className="w-4 h-4" />
                            </button>                 
                        </div>
                        </div>
                    </section>
                    <hr className="text-gray-300 mt-4"/>

                    {/* messages*/}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100 ">
                        {sortedDates.map((date) => {
                            return (
                                <div key={date}>
                                    <div className="flex justify-center my-2 text-gray-500 text-xs font-semibold">
                                        {date}
                                    </div>
                                    {groupMessages[date].map(message => {
                                        let intials = "";
                                        // console.log("log_date:", message.log_date);

                                        if (message.user_name) {
                                            intials = message.user_name.split(" ").map((word: string) => word[0].toUpperCase()).join("");
                                        }

                                        console.log(`${baseUrl}/uploads/${message.file_name}`)

                                        return (
                                            <div key={message.chitchat_id} className='flex flex-col justify-start mb-4'>
                                                {/* message content */}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Avatar className="border-none shadow-md bg-gray-700 text-white cursor-pointer">
                                                        <AvatarImage src="" />
                                                        <AvatarFallback >{intials}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex gap-4 items-center">
                                                            <h4 className='text-sm text-gray-600 capitalize'>
                                                                {message.user_name || authStore.user?.name || "Anonymous"}
                                                            </h4>
                                                        </div>

                                                        <div className="flex items-baseline-last">
                                                            <div className="">
                                                                <p className="px-4 rounded-md w-fit  bg-gray-200 text-gray-800 py-2">
                                                                    {message.text}
                                                                </p>
                                                                <span className="text-xs text-gray-400 flex justify-end">
                                                                    {formatTimeAgo(message.log_date)}
                                                                </span>
                                                            </div>
                                                            <ChatFunction />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* file Message */}
                                                {message.file_name && (
                                                    <img
                                                        src={`${baseUrl}/uploads/message/${message.file_name}`}
                                                        alt={message.file_name}
                                                        className="max-w-40 rounded-md ml-12 shadow-lg bg-white p-0.5 hover:shadow-2xl"
                                                    />
                                                )}
                                            </div>
                                        )
                                    }
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* sidebar */}
                <aside className="w-96 p-4 overflow-y-auto hidden lg:block">
                    <div className="bg-white flex flex-col p-4 rounded-lg shadow-md hover:shadow-xl">
                        <h2 className="font-semibold mb-4 text-center">Incident Details</h2>
                        <hr className="text-gray-400" />
                        <div className="flex flex-col mt-4 gap-2">
                            <p className="text-md font-semibold">Location:
                                <span className="text-sm font-normal capitalize"> {location}</span>
                            </p>
                            <p className="text-md font-semibold" >Hazard:
                                <span className="text-sm font-normal capitalize"> {incident?.hazard_name}</span>
                            </p>
                            <p className="text-md font-semibold">Reporter:
                                <span className="text-sm font-normal capitalize"> {incident?.name}</span>
                            </p>
                            <p className="text-md font-semibold">Time:
                                <span className="text-sm font-normal capitalize"> {incident?.created_at ? new Date(incident.created_at).toLocaleString() : ""}</span>
                            </p>
                            <p className="text-md font-semibold">Priority:
                                <span className="text-sm font-normal capitalize"> {incident?.priority}</span>
                            </p>
                        </div>
                    </div>
                </aside>
            </main>
        </section>
    )
})
export default IncidentChatRoom;