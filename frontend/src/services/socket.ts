import {io} from "socket.io-client";


const socket= io(import.meta.env.VITE_BASE_URL ,{
    query : {userId : "100"},
    withCredentials : true
})


export default socket;