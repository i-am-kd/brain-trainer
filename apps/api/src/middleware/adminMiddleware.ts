import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const adminOnly = (req: Request, res:Response, next: NextFunction) =>{
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({error: "Not Authorized"});

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as {id: string; role: string};
        if (decoded.role !== "admin"){
            return res.status(403).json({error: 'Admin access required'});
        }
        req.body.userId = decoded.id;
        next();
    }
    catch(error){
        res.status(401).json({error :(error as Error).message});
    }
};