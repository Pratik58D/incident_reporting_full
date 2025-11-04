// import { apiUrl } from "@/env";
// import userStore from "@/store/userStore";
// import axios from "axios";
// import { authStore } from "@/store/authStore";
import api from "@/lib/refreshtoken";


export const getChitChat = async(incidentId:number)=>{
    const res = await api.get(`/chitchat/${incidentId}`);
    // console.log("chichatsevices all messages:",res.data.data)
    return res.data.data;
}

export const postChitchat = async(
    incidentId: number , 
    text:string, 
    file?: File | null 
)=>{   
    const formData = new FormData();
    if(text) formData.append("text",text)
    if(file) formData.append("file",file)

    const res = await api.post(`/chitchat/${incidentId}`,
        formData ,{
            headers :{
                "Content-Type" : "multipart/form-data",
                // Authorization : `Bearer ${authStore.accessToken}`
            },
            withCredentials : true,
        }
    );
    console.log(res.data.data)
    return res.data;
}