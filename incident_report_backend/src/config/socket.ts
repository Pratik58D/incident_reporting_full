import { Server as IOServer, Socket } from "socket.io";
import type { Server } from "http";

//used to store online users
const userSocketMap: Record<string, string> = {};

export function initSocket(server: Server) {
    const io = new IOServer(server, {
        cors: {
            origin: true,
            credentials: true
        }
    });
    io.on("connection", (socket: Socket) => {

        // console.log("client connected", socket.id);
        
        const userId = socket.handshake.query.userId as string;      
       
        if (userId) userSocketMap[userId] = socket.id;

        // Emit online users to all clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        //join an incident room
        socket.on("join:incident", ({ incidentId }:{incidentId:number}) => {
            socket.join(`incident:${incidentId}`);
            socket.emit("joined", { room: `incident : ${incidentId}` });
            console.log(`Socket ${socket.id} joined incident:${incidentId}`);
        });

        //send message
        //   socket.on(
        //     "message:create",
        //     ({incidentId ,text} : {incidentId:number ; text:string })=>{
        //         if(!incidentId || !text) return ;
        //         const payload ={incidentId , text , sender: socket.id , createdAt : new Date()};
        //         io.to(`incident : ${incidentId}`).emit("message:new" ,payload);
        //     }
        // )    

        socket.on("disconnect", () => {
            console.log("client disconnected: ", socket.id)
            if (userId) delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        })
    });
    return io;
};


// Helper to get socketId of a user
export function getReceiverSocketId(userId: string) {
    return userSocketMap[userId];
}

