//This is main chat room 

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getChitChat, postChitchat } from "@/services/chitchatService";
import socket from "@/services/socket";
import { ArrowLeft, Mic, Paperclip, Send, Users } from "lucide-react"
import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify";


interface Message {
    incidentId: number,
    userId: number,
    text?: string;
    fileId?: number | null;
    file_name?: string;
}

const IncidentChatRoom = () => {

    const { incidentId } = useParams<{ incidentId: string }>();
    const incidentIdNum = incidentId ? parseInt(incidentId, 10) : undefined;

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const userName = localStorage.getItem("displayName") || "reporter";
    let intials = "";
    if (userName) {
        intials = userName.split(" ").map(word => word[0].toUpperCase()).join("");

    }

    console.log("user:", userName, 'inciden is: ', incidentId)

    //load existing message from backend

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
        socket.emit("join:incident", {incidentId: incidentIdNum });

        socket.on('message:new', (msg: Message) => {
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
        }
    }

    const handleSend = async () => {
        if (!newMessage.trim() && !file) return;
        if (!incidentIdNum) return;
        const res = await postChitchat(incidentIdNum, newMessage, file);
        console.log(res.data)
    
        toast.success("message send")
        setNewMessage("");
        setFile(null)
    }

    console.log(messages)




    return (
        <section className="h-screen flex flex-col">
            {/* header section */}
            <header className="flex justify-between items-center border-b border-b-gray-200 shadow-md px-2  md:px-10 py-5 flex-shrink-0">
                <div className="flex gap-5 sm:gap-10">
                    <div className="flex gap-1 items-center justify-center">
                        <ArrowLeft className="w-4 h-4" />
                        <Link to="/chat">Back</Link>
                    </div>
                    <div className="flex gap-2">
                        <h1>logo</h1>
                        <h1 className="">Incident Room Name</h1>
                    </div>
                </div>

                <div className="bg-success flex items-center rounded-md px-3 py-1 gap-2 text-white">
                    <Users />
                    <div className="flex gap-1 text-medium">
                        <p>3</p>
                        <p>online</p>
                    </div>

                </div>
            </header>

            {/* main chat section */}
            <main className="flex flex-1  overflow-hidden">
                {/* chat area  */}
                <div className="flex flex-col flex-1 border-r border-gray-200">
                    {/* messages*/}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        <div className="flex justify-center text-white">
                            <p className=" bg-gray-800 px-3 py-0.5 rounded-lg">{userName} joined the chat.</p>
                        </div>
                        {/* Repeat to test scroll */}
                        {messages.map((message) => (
                            <div className="flex justify-end gap-2" key={message.chitchat_id}>

                                <div className="flex flex-col gap-1 ">
                                    <h4 className="text-gray-600 text-right">pratik devkota</h4>
                                    <p className="bg-primaryCol text-white px-4 py-2 rounded-md w-fit">
                                        {message.text}
                                    </p>
                                </div>
                                <Avatar className="border border-gray-300 shadow-md bg-gray-700 text-white">
                                    <AvatarImage src="" />
                                    <AvatarFallback>{intials}</AvatarFallback>
                                </Avatar>
                            </div>

                        ))}
                    </div>

                    {/* messages chat field this has to be fixed at button */}
                    <footer className="border-t border-gray-300 px-4 md:px-10 py-3 bg-white shadow-inner flex items-center gap-3 ">
                        {/* icons */}
                        <div className="">
                            <input
                                type="file"
                                id="chat-file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="chat-file-upload"
                            >
                                <Paperclip className="w-5 h-5" />

                            </label>

                        </div>

                        <div className="flex flex-1 items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 bg-gray-50">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent outline-none text-sm"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button
                                className="text-gray-500 hover:text-gray-700 transition-color"
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                        </div>

                        <button
                            className="bg-primaryCol text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-800"
                          onClick={handleSend}    
                         >
                            <Send className="w-4 h-4" />
                        </button>
                    </footer>
                </div>

                {/* sidebar */}
                <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto hidden lg:block">
                    <h2 className="font-semibold mb-4">Incident Details</h2>
                    <div className="space-y-2 text-sm text-gray-600"></div>
                    <p>Location: Emergency Area</p>
                    <p>Type: Fire Hazard</p>
                    <p>Status: Active</p>
                    <p>Reporter: Pratik Devkota</p>
                    <p>Time: 2:30 PM</p>
                    <p>Priority: High</p>
                    <p>Responders: 3 active</p>

                </div>

            </main>


        </section>
    )
}

export default IncidentChatRoom