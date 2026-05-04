import express, {Request, Response} from 'express';
import { calculateScore } from '@brain-trainer-game/utils';


const app = express();
app.use(express.json());

//health check route 
app.get('/health', (req: Request, res: Response)=>{
    res.status(200).json({
        status: "OK",
        timeStamp: new Date().toISOString(),
        sampleScore: calculateScore(true, 'hard', 10000)
    });
});

export default app;