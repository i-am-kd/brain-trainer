import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.js";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./features/auth/components/LoginForm.js";
import { GameScreen } from "./features/game/components/gameScreen.js";
import { useAuthStore } from "./store/useAuthStore.js";

// Protected Route Wrapper
const ProtectedRoute = ({children}: {children: React.ReactNode}) =>{
    const {isAuthenticated} = useAuthStore();
    return isAuthenticated? children: <Navigate to="/login"/>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/login" element={<LoginForm />}/>
                    <Route path="/game" element={<ProtectedRoute><GameScreen/></ProtectedRoute>} />

                    <Route  path="/" element={<Navigate to ="/game" />}/>
                </Routes>
            </div>
        </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
