import {io , Socket} from "socket.io-client";
// import userStore from "@/store/userStore";
import { authStore } from "@/store/authStore";
import { baseUrl } from "@/env";

let socket : Socket | null = null;

export const intializeSocket=()=>{
    if(socket?.connected){
        console.log("Socket already connected");
        return socket
    }
    const userId = authStore.user?.id?.toString();
    console.log("intializing socket for user:" , userId);

    if(!userId){
        console.warn("cannot intialize socket : No user ID");
        return null
    }
    socket= io(baseUrl ,{
        query :{userId},
        withCredentials : true,
        reconnection :true,
        reconnectionAttempts:5,
        reconnectionDelay:1000,
    })

    socket.on("connect", () => {
        console.log(" Socket connected:", socket?.id);
    });
     socket.on("disconnect", (reason) => {
        console.log(" Socket disconnected:", reason);
    });
     socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
    });
    return socket;
}

export const disconnectSocket = () => {
    if (socket?.connected) {
        console.log(" Disconnecting socket");
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = (): Socket | null => {
    return socket;
};




// const getUserId = ()=>{
//     return authStore.user?.id?.toString()|| null;
// }

// const socket= io(import.meta.env.VITE_BASE_URL ,{
//     query : {
//         userId : getUserId()
//     },
//     withCredentials : true,
//     autoConnect : false
// })

// if(getUserId()){
//     socket.connect()
// }

export default {
    intialize : intializeSocket,
    disconnect : disconnectSocket,
    get : getSocket
};