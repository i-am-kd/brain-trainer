import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi.js";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";

export const LoginForm: React.FC = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useAuthStore();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: () =>authApi.login(email, password),
        onSuccess: (data) =>{
            login(data.user, data.token);
            if (data.user.role ==='admin'){
              navigate('/admin')
            }
            else{
                navigate('/game')
            }
            
        },
        onError: (error) =>{
            alert("Login failed: "+ error.message);
        },
    });

    const handleSubmit = (e: React.SubmitEvent) =>{
        e.preventDefault();
        mutation.mutate();
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg  shadow-md w-full max-w-md">
            <h2 className="text-2xl font-solid mb-6 text-center text-gray-800">Brain Trainer Login</h2>
            <div className="mb-4">
                <label  className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:rring-blue-500" required />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <button type="submit" disabled={mutation.isPending} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:bg-gray-400">
                {mutation.isPending ? "Logging in...": "Login"}
            </button>
        </form>

        </div>
            );
};
