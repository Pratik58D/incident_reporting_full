import { makeAutoObservable , runInAction } from "mobx";
import axios from "axios";
import api from "@/lib/refreshtoken";
// import { apiUrl } from "@/env";
import socketService from "@/services/socket"; 

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
    loading = true;
    error : string | null = null;
    isAuthenticated = false;

    constructor(){
        makeAutoObservable(this);
        this.intializeAuth();
    }

    async intializeAuth(){
        try{
            const res = await api.post(
                "/users/refresh",
                {}
            );
            runInAction(()=>{
                console.log(res.data);
                this.accessToken = res.data.accessToken;
                this.user = res.data.user;
                this.isAuthenticated = true;
                this.loading = false;
            })

            // intialize socket after successful auth
            socketService.intialize();
        }catch{
            runInAction(()=>{
                this.user = null;
                this.accessToken = null;
                this.isAuthenticated = false;
                this.loading = false;
            })
        }
    }
          
    async signup(data:{
            name : string; 
            phone_number: string; 
            email?:string;
            password:string;
            role?:string
        }){
            this.loading = true;
            try {
                const res= await api.post(
                    "/users/signup",
                    data,
                    {withCredentials : true}
                
                );
                runInAction(()=>{
                    this.user = res.data.user;
                    this.accessToken = res.data.accessToken;
                    this.isAuthenticated = true;
                    this.error = null;
                });   
                
         // intialize socket after successful auth
            socketService.intialize();
    
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
            const res = await api.post(
                "/users/login",
                {identifier , password},
                {withCredentials : true}
            );
            runInAction(()=>{
                this.user = res.data.user;
                this.accessToken = res.data.accessToken;
                this.isAuthenticated = true;
                this.error = null;
            });
            // intialize socket after successful auth
            socketService.intialize();
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
       try {
         await api.post("/users/logout");
           
       } catch (error) {
        console.warn("Logoout request failed", error);
       }finally{
          // Disconnect socket before clearing auth
        socketService.disconnect();
        runInAction(()=>{
            this.user = null;
            this.accessToken = null;
            this.isAuthenticated = false
            this.error = null;
        })
       }
    }

    async refreshAccessToken(){
        try{
            const res = await api.post(
                "/users/refresh",
                {},
                {withCredentials : true}    

            );
            runInAction(()=>{       
                console.log("token refreshed",res.data)  
                this.accessToken = res.data.accessToken;
                this.user = res.data.user;
                this.isAuthenticated = true;
            });
            return res.data.accessToken;
        }catch(err ){
            runInAction(()=>{
                this.user = null;
                this.accessToken = null;
                this.isAuthenticated = false
            })
            throw err;
        }
    }

    getAuthHeaders(){
        return this.accessToken ? {Authorization : `Bearer ${this.accessToken}`} : {};
    }
}

export const authStore = new AuthStore();