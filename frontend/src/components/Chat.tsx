import { useEffect ,useState, type ChangeEvent } from "react";
import socket from "../services/socket";
import { getChitChat, postChitchat } from "../services/chitchatService";

interface Message {
    incidentId : number,
    userId : number,
    text? : string;
    fileId? : number |null;
    file_name? : string;
}
export default function IncidentChat(){
    const incidentId = 3;    //fixed for now testing purpose
    const [messages , setMessages] = useState<Message[]>([]);
    const [newMessage , setNewMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    
    //load existing message from backend
    useEffect(()=>{
        const fetchMessages = async()=>{
            const data = await getChitChat(incidentId);
            setMessages(data || []);
        };
        fetchMessages();
    },[incidentId])

    //join the socket room and listen for new messages
    useEffect(()=>{
        socket.emit("join:incident",{incidentId});

        socket.on("message:new" , (msg:Message)=>{
            setMessages((prev)=>[...prev , msg])
        });

        return ()=>{
            socket.off("message:new");
        };
    },[incidentId])

    //handle file input change
    const handleFileChange = (e : ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files.length >0){
            setFile(e.target.files[0]);
        }
    }
    const handleSend = async()=>{
        if(!newMessage.trim() && !file) return ;
        await postChitchat(incidentId , newMessage ,file);
        setNewMessage("");
        setFile(null)
    };

    return(
         <div className="p-4 border rounded w-[400px]">
                <h2 className="font-bold mb-2">Flood Incident Chat (ID: {incidentId})</h2>
                {/* messages */}
                <div className="h-60 overflow-y-auto border p-2 mb-2">


                    {messages.map((message , idx)=>(
                         <div key={idx} className="mb-2">
                            <strong>User {message.userId}:</strong>{" "}
                             {message.text && <span>{message.text}</span>}
                             {message.file_name && (
                                <a 
                                href={`${import.meta.env.VITE_API_URL}/uploads/${message.file_name}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 underline ml-2"  
                                >
                                    {message.file_name}
                                </a>
                             )}
                             </div>
                    ))}
                </div>

            {/* input */}
              <div className="flex items-center gap-2">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="border p-2 flex-1"
                    placeholder="Type your message..."
                    />
                    <input type="file" onChange={handleFileChange} />
                    <button
                        onClick={handleSend}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                    Send
                    </button>
              </div>
         </div>

    )

}

