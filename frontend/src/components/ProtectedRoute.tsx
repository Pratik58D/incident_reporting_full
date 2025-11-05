
// export default ProtectedRoute;
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";
import { authStore } from "@/store/authStore";
import Loading from "./Loading";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = observer(({ children }: ProtectedRouteProps) => {
    // Show loading state while checking authentication
    if (authStore.loading) {
        return (
           <Loading />
        );
    }

    // After loading, check if user is authenticated
    if (!authStore.isAuthenticated || !authStore.user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
});

export default ProtectedRoute;