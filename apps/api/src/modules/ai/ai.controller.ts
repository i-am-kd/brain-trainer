import { Request, Response } from "express";
import { AIService } from "./ai.service.ts";
import { z } from "zod";

const GenerationSchema = z.object({
    topic: z.string().min(3),
    count: z.number().min(3).max(10),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    wordsPerSequence: z.number().min(5).max(40),
});

export const AIController = {
    async generateContent(req: Request, res: Response){
        try{
            const validated = GenerationSchema.parse(req.body);
            const sequences = await AIService.generateAndStore(validated);

            res.status(201).json({
                message: `Sucessfully generated and stored  ${sequences.length} sequences`,
                count: sequences.length,
            })

        }catch(error){
            res.status(500).json({error: (error as Error).message});
        }
    },
};