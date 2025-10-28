import {formatDistanceToNow} from "date-fns";
import type { MessageType } from "@/pages/IncidentChatRoom";

// grouping message in same date together
export const groupMessagesByDate =(messages:MessageType[])=>{
    const groups : Record<string , MessageType[]> = {};

    messages.forEach((msg) => {
        const dateKey = new Date(msg.log_date).toDateString();
        if(!groups[dateKey]) groups[dateKey] =[];
        groups[dateKey].push(msg);
    })
    
    // sort messages within each date(latest first)
    Object.keys(groups).forEach((key)=>{
        groups[key].sort(
            (a,b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
        )
    });
    return groups;
}

// finding how long ago is the message
export const formatTimeAgo = (dateString :string)=>{
    if(!dateString) return "";
    const date = new Date(dateString);
    if(isNaN(date.getTime())) return "";
    return formatDistanceToNow(new Date(dateString), {addSuffix :true})
}