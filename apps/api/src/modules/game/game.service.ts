import { GameSession } from "../../db/models/GameSession.ts";
import { calculateScore } from "@brain-trainer-game/utils";
import { Difficulty, GameResult } from "@brain-trainer-game/types";

const WORD_SEQUENCE  = [
    {id: 'seq_1', words:['apple', 'banana', 'cherry'], difficulty: 'easy' as Difficulty},
    {id:'seq_2', words: ['elephant, giraffe, hippopotamus'], difficulty: 'medium' as Difficulty}
];

export const GameService = {
    async getSquence(): Promise<typeof WORD_SEQUENCE[0] | undefined>{
        return WORD_SEQUENCE[Math.floor(Math.random() *WORD_SEQUENCE.length)];
    },

    async submitResult(
        userId: string,
        sequenceId: string,
        userInput: string[],
        durationMs: number
    ): Promise<GameResult>{
        const sequence = WORD_SEQUENCE.find((s) => s.id === sequenceId);
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



