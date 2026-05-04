import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './db/connect.ts';
const PORT = process.env.PORT || 5001;

const startServer = async () =>{
    try{
        await connectDB();
        app.listen(PORT, () =>{
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }catch (error){
        console.error("Failed to start server or connect to database.", error);
        process.exit(1);
    }
};

startServer();