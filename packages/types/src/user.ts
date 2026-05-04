export interface User {
    _id?: string;
    email: string;
    username: string;
    passwordHash?: string; // used internally by backend 
    createdAt: Date;
}

export interface AuthResponse{
    token: string;
    user: Omit<User, 'passwordHash'>;
}

