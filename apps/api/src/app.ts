import express, {Request, Response} from 'express';
import authRoutes from './modules/auth/auth.routes.ts';
import gameRoutes from './modules/game/game.routes.ts';

const app = express();
app.use(express.json());

//health check route 
app.get('/health', (req: Request, res: Response)=>{
    res.status(200).json({
        status: "OK",
        timeStamp: new Date().toISOString()
     });
     
});

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);



export default app;