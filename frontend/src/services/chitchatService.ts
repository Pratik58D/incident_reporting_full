import { apiUrl } from "@/env";
import axios from "axios";



export const getChitChat = async(incidentId:number)=>{
    const res = await axios.get(`${apiUrl}/chitchat/${incidentId}`);
    console.log(res.data.data)
    return res.data.data;
}


export const postChitchat = async(incidentId: number , text:string,file?: File | null)=>{

    const userId = JSON.parse(localStorage.getItem("chatUser") || "null");
    const formData = new FormData();
    if(text) formData.append("text",text)
    if(file) formData.append("file",file)
    if(userId) formData.append('userId' ,userId)

    const res = await axios.post(`${apiUrl}/chitchat/${incidentId}`,
        formData ,{
            headers :{"Content-Type" : "multipart/form-data"}
        }
    );
    console.log(res.data.data)
    return res.data;
}