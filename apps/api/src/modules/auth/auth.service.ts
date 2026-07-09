import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../db/models/User.ts';
import { AuthResponse} from '@brain-trainer-game/types';

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";


export const AuthService = {
    async register(email: string, username: string, passwrod: string, role: 'user' | 'admin'): Promise<AuthResponse>{
        const existingUser  = await User.findOne({$or: [{email}, {username}]});
        if (existingUser) throw new Error("User already exists.");

        const passwordHash = await bcrypt.hash(passwrod, 10);
        const user = await User.create({
            email, 
            username, 
            passwordHash,
            role: role ==='admin'? 'admin': 'user',
        });

        const token = jwt.sign({id: user._id, role: user.role}, JWT_SECRET, {expiresIn: '5h'});

        return {
            token, 
            user: {
                _id: user._id.toString(),
                email: user.email, 
                username: user.username,
                role: user.role,
            },
        };
    },

    async login(email: string, password: string): Promise<AuthResponse>{
        const user = await User.findOne({email});
        if(!user) throw new Error("Invalid Credentials");

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch) throw new Error("Invalid Crendentials.");

        const token = jwt.sign({id: user._id, role: user.role}, JWT_SECRET, {expiresIn: "5h"});

        return {
            token, 
            user: {
                _id: user._id.toString(),
                email: user.email,
                username: user.username,
                role: user.role,
            },
        };
    },
};