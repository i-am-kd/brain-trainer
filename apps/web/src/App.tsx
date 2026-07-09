import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./features/auth/components/LoginForm.js";
import { GameScreen } from "./features/game/components/gameScreen.js";
import { useAuthStore } from "./store/useAuthStore.js";
import { AdminPanel } from "./features/admin/components/AdminPanel.js";
import { AdminRoute } from "./features/admin/components/AdminRoute.js";
import { useEffect } from "react";

// Protected Route Wrapper
const ProtectedRoute = ({children}: {children: React.ReactNode}) =>{
    const {isAuthenticated} = useAuthStore();
    return isAuthenticated? children: <Navigate to="/login"/>;
};

function App() {
    const {checkAuth} = useAuthStore();

    useEffect(()=>{
        checkAuth();
    }, []);
  return (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/login" element={<LoginForm />}/>
                    <Route path="/game" element={<ProtectedRoute><GameScreen/></ProtectedRoute>} />
                    <Route path='/admin' element ={<AdminRoute><AdminPanel /></AdminRoute>} />
                    <Route  path="/" element={<Navigate to ="/login" />}/>
                </Routes>
            </div>
        </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
