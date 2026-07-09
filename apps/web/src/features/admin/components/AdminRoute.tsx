import React ,{ReactNode} from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore.js";

export const AdminRoute: React.FC<{children: ReactNode}> =({ children}) =>{
    const {isAuthenticated, isAdmin} = useAuthStore();

    if(!isAuthenticated) return <Navigate to ='/login' />
    if(!isAdmin) return <Navigate to="/game" /> 

    return children;
}