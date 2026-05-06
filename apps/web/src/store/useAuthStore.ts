import {create} from 'zustand';
import { User, PublicUser} from '@brain-trainer-game/types';

interface AuthState{
    user: PublicUser| User| null;
    token: string| null;
    isAuthenticated: boolean;
    login: (user: PublicUser, token: string) =>void;
    logout: () => void;
}


export const useAuthStore = create<AuthState>((set) =>({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem('token'),

    login: (user, token) =>{
        localStorage.setItem('token', token);
        set({user, token, isAuthenticated: true})
    },
    logout: ()=>{
        localStorage.getItem('token');
        set({user: null, token: null, isAuthenticated: false})
    },
}));