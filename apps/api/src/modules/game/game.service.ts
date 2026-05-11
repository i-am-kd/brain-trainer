import { GameSession } from "../../db/models/GameSession.ts";
import { calculateScore } from "@brain-trainer-game/utils";
import { Difficulty, GameResult } from "@brain-trainer-game/types";
import { WordSequence } from "../../db/models/wordSequence.js";




export const GameService = {
    async getSquence(){
        const sequence = await WordSequence.aggregate([
            {$match: {isActive: true}},
            {$sample: {size: 1}}
        ]);

        if (!sequence || sequence.length ===0){
            throw new Error ("No sequences available. Please ask admin to generaet content.");
        }
        return sequence[0];
    },

    async submitResult(
        userId: string,
        sequenceId: string,
        userInput: string[],
        durationMs: number
    ): Promise<GameResult>{
        const sequence = await WordSequence.findById(sequenceId);
        if(!sequence) throw new Error("Invalid Sequence ID");

        //check correctness 
        const isCorrect= JSON.stringify(sequence.words)  === JSON.stringify(userInput);

        //calculate the score using shared utility 
        const score = calculateScore(isCorrect, sequence.difficulty, durationMs);
        const session = await GameSession.create({
            userId, sequenceId, userInput, isCorrect, score, durationMs
        });

        return {
            sessionId: session._id.toString(),
            score, 
            feedback: isCorrect?"Great Job!":"Keep practicing",
        };
    }
};



