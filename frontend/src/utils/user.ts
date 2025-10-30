import axios from "axios";
import { apiUrl } from "@/env";
import userStore from "@/store/userStore";


interface UserData{
    name : string;
    phone_number : string;
    email?: string;
}

export const getOrCreateUser = async(data : UserData) =>{
    // 1.Check if already in Mobx store
    if(userStore.isLoggedIn) return userStore.user;

    const phone_number = data.phone_number.trim();
    const email = data.email?.trim() || undefined;

    //2.check user exist or not
    const checkRes = await axios.get(`${apiUrl}/users/check`,{
        params:{phone_number, email},
    });

    let user;
    if(checkRes.data.exists){
        user = checkRes.data.user;
    }else{
        //3.create new user if not exists
        const res = await axios.post(`${apiUrl}/users`,{
            name :data.name,
            phone_number : data.phone_number,
            email : data.email || null,
        });
        user = res.data.user;
    }

    //4.save to MObX store
    userStore.setUser(user);
    return user;
}