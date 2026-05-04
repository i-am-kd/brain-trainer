import mongoose from 'mongoose';


const  MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/brain-trainer';

export const connectDB = async (): Promise<void> =>{
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(err){
        console.error(`Error: ${(err as Error).message}`);
        process.exit(1);
    }
}