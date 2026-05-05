import { Request, Response } from "express";
import { GameService } from "./game.service.ts";
import {z} from 'zod';


const SubmitSchema = z.object({
    sequenceId: z.string(),
    userInput: z.array(z.string()),
    durationMs: z.number(),
});

export const GameController = {
    async getSequence(req: Request, res:Response){
        try{
            const sequence = await GameService.getSquence();
            res.json(sequence);
        }catch(error){
            console.error("Failed to fetch sequence", error);
            res.status(500).json({
                sucess: false, 
                error:{
                    code: "SEQUENCE_FETCH_FAILED",
                    message: "Failed to fetch sequence"
                }
            });
        };
    },
    async submitResult(req: Request, res: Response){
        try{
            const userId = req.body.userId|| "123b...";

            const {sequenceId, userInput, durationMs } = SubmitSchema.parse(req.body);
            const result = await GameService.submitResult(userId, sequenceId, userInput, durationMs);
            res.json(result);
        }catch(error){
            res.status(400).json({error: (error as Error).message});
        }
    },
};