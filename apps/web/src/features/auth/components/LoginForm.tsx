import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi.js";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { useNavigate } from "react-router";

export const LoginForm: React.FC = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useAuthStore();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: () =>authApi.login(email, password),
        onSuccess: (data) =>{
            login(data.user, data.token);
            navigate('/game');
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
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
            <h2 className="text-xl mb-4">Login</h2>
            <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  className="w-full p-2 border rounded required" />
            </div>
            <button type="submit" disabled={mutation.isPending} className="w-full bg-blue-500 text-white p-2 rounded hover: bg-blue-600 disabled:bg-gray-400">
                {mutation.isPending ? "Logging in...": "Login"}
            </button>
        </form>
    )

}
