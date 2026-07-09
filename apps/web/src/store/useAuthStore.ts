import {create} from 'zustand';
import { User, PublicUser} from '@brain-trainer-game/types';

interface AuthState{
    user: PublicUser| User| null;
    token: string| null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (user: PublicUser, token: string) =>void;
    logout: () => void;
    checkAuth: () =>void;
}

export const useAuthStore = create<AuthState>((set) =>({
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem('token'),
    isAdmin:localStorage.getItem('userRole') === 'admin',

    login: (user, token) =>{
        localStorage.setItem('token', token);
        if(user.role){
            localStorage.setItem('userRole', user.role)
        }
        else{
            localStorage.removeItem('userRole');
        }
        set({user, token, isAuthenticated: true, isAdmin: user.role === 'admin'})
    },
    logout: ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        set({user: null, token: null, isAuthenticated: false, isAdmin: false})
    },
    checkAuth: () =>{
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');

        set({
            isAuthenticated: !! token,
            isAdmin: role === 'admin',
            token: token,
        })
    }
}));