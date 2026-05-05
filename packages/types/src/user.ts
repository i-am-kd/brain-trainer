export interface User {
    _id?: string;
    email: string;
    username: string;
    passwordHash?: string; // used internally by backend 
    createdAt: Date;
}

export interface PublicUser {
    _id: string;
    email: string;
    username: string;
}

export interface AuthResponse{
    token: string;
    user: PublicUser  //Omit<User, 'passwordHash'>;
}

