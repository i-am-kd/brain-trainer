import apiClient from "../../../lib/axios.js";
import { AuthResponse } from "@brain-trainer-game/types";

export const authApi ={
    login: async (email: string, password: string): Promise<AuthResponse> =>{
        const {data } = await apiClient.post('/auth/login', {email, password});
        return data;
    }, 
    register: async (email: string, username: string, password: string): Promise<AuthResponse> =>{
        const {data} = await apiClient.post('/auth/register', {email, username, password});
        return data;
    },
};

