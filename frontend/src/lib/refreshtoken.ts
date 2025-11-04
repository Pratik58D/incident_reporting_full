import axios from "axios";
import { authStore } from "@/store/authStore";
import { apiUrl } from "@/env";

const api = axios.create({
    baseURL : apiUrl,
    withCredentials : true
});

//attach access token to every request
api.interceptors.request.use(
    (config) => {
    const token = authStore.accessToken;
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
},
(error) => Promise.reject(error)
);

// refresh token automatically if access token expired
api.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const originalRequest = error.config;
        if(
            error.response &&
            (error.response.status === 401 || error.response.status === 403)&&
            !originalRequest._retry
        ){
            originalRequest._retry = true;
            try{
                console.log("🔄 Access token expired, refreshing...");
                
                // get new token from authStore
                const newToken =await authStore.refreshAccessToken();

                console.log("token refreshed sucessfully")
                
                // retry original request with token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest)
            }
            catch(refreshError){
                // logout user if refrsh fails
                authStore.logout();
                
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error)
    }
)
export default api;