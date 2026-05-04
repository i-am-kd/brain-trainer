import { Difficulty } from "@brain-trainer-game/types";

/**
 * calculate the score based on accuracy, difficulty and speed 
 * 
 * @param isCorrect - Did the use get the sequence right?
 * @param difficulty - the difficulty level of the sequence 
 * @param durationMs - time taken in milliseconds 
 * @returns the calculated score (number)
 */

export const calculateScore = (isCorrect: boolean,  difficulty: Difficulty,  durationMs: number): number =>{
    if (!isCorrect) return 0;

    //base score per difficulty 
    const baseScore: Record <Difficulty, number> ={
        easy: 15, 
        medium: 35,
        hard: 70,
    };

    let score = baseScore[difficulty];
    const maxTimeForBonus = 30000; //30 second 
    const minTimeForFullBonus = 5000; //5 second 

    if (durationMs < minTimeForFullBonus){
        score +=10;
    } else if (durationMs < maxTimeForBonus){
        const ratio = 1 - (durationMs - minTimeForFullBonus) / (maxTimeForBonus- minTimeForFullBonus);
        score += Math.round(10*ratio)
    }

    return score;
}