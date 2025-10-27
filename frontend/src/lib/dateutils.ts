import {formatDistanceToNow} from "date-fns";
import type { MessageType } from "@/pages/IncidentChatRoom";

// grouping message in same date together
export const groupMessagesByDate =(messages:MessageType[])=>{
    const groups : Record<string , MessageType[]> = {};
    messages.forEach(msg=>{
        const dateKey = new Date(msg.log_date).toDateString();
        if(!groups[dateKey]) groups[dateKey] =[];
        groups[dateKey].push(msg);
    })
    return groups;
}

// finding how long ago is the message
export const formatTimeAgo = (dateString :string)=>{
    return formatDistanceToNow(new Date(dateString), {addSuffix :true})
}