// steup API Client 
// This instance will automatically attach the JWT token to every request if it exists in LocalStorage

import axios from "axios";

const apiClient = axios.create({
    baseURL:'/api',
    headers:{
        'Content-Type': 'application/json',
    },
});

// requrest interceptoer : Attach token
apiClient.interceptors.request.use((config) =>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response interceptor: Handle Errors 
apiClient.interceptors.response.use(
    (response) => response,
    (error) =>{
        if(error.response?.status === 4001){
            // optional: clear token and redirect to login
            localStorage.removeItem('token');
            globalThis.location.href= '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;