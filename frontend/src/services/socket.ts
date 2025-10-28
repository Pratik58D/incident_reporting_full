import {io} from "socket.io-client";
import userStore from "@/store/userStore";

const getUserId = ()=>{
    return userStore.user?.id?.toString()|| null;
}

const socket= io(import.meta.env.VITE_BASE_URL ,{
    query : {
        userId : getUserId()
    },
    withCredentials : true,
    autoConnect : false
})

if(getUserId()){
    socket.connect()
}

export default socket;