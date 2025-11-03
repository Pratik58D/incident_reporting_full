import { makeAutoObservable , runInAction } from "mobx";
import axios from "axios";
import { apiUrl } from "@/env";

// send cookies automatically
axios.defaults.withCredentials =true;

interface User{
    id: number;
    name : string;
    email : string | null;
    phone_number: string;
    role : string;
}

export class AuthStore{
    user : User | null = null;
    accessToken: string | null = null;
    loading = false;
    error : string | null = null;

    constructor(){
        makeAutoObservable(this);
    }

    async signup(
        data:{
            name : string; 
            phone_number: string; 
            email?:string;
            password:string;
            role?:string
        }){
            this.loading = true;
            try {
                const res= await axios.post(`${apiUrl}/user/signup`,data);
                runInAction(()=>{
                    this.user = res.data.user;
                    this.accessToken = res.data.accessToken;
                    this.error = null;
                });       
            } catch (error : unknown) {
                runInAction(()=>{
                    if(axios.isAxiosError(error)){
                    this.error = error.response?.data?.message || "Signup failed";
                    }else if(error instanceof Error){
                        this.error = error.message
                    }
                })
            }finally{
                runInAction(()=>{
                    this.loading = false
                })
            }
        }

    async login(identifier : string , password : string){
        this.loading = true;
        try{
            const res = await axios.post(`${apiUrl}/users/login`,{identifier , password});
            runInAction(()=>{
                this.user = res.data.user;
                this.accessToken = res.data.accessToken;
                this.error = null;
            })
        }catch(error : unknown){
            runInAction(()=>{
               if(axios.isAxiosError(error)){
                    this.error = error.response?.data?.message || "login failed";
                    }else if(error instanceof Error){
                        this.error = error.message
                    }
            })
        }finally{
            runInAction(()=>{
                this.loading = false
            })
        }
    }

    async logout(){
        await axios.post(`${apiUrl}/users/logout`);
        runInAction(()=>{
            this.user = null;
            this.accessToken = null;
        })
    }


    async refreshAccessToken(){
        try{
            const res = await axios.post(`${apiUrl}/users/refresh`);
            runInAction(()=>{
                this.accessToken = res.data.accessToken;
            })
        }catch(err ){
            runInAction(()=>{
                this.user = null;
                this.accessToken = null;
                console.log(err)
            })
        }
    }

    getAuthHeaders(){
        return this.accessToken ? {Authorization : `Bearer ${this.accessToken}`} : {};
    }

}

export const authStore = new AuthStore();