import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import { authStore } from "@/store/authStore";

interface ProtectedRouteProps{
    children :React.ReactNode;
}

const ProtectedRoute =observer(({children}: ProtectedRouteProps)=>{
    if(!authStore.user || !authStore.accessToken){
        return <Navigate to="/login" replace />
    }
    return children;
})

export default ProtectedRoute;