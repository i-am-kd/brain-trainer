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
        easy: 100, 
        medium: 200,
        hard: 400,
    };

    const timeLimits : Record<Difficulty, {target:number; max: number}> ={
        easy: {target: 8000, max: 20000},
        medium: {target: 12000, max: 30000},
        hard: {target: 15000, max: 40000}
    }

    const {target, max} = timeLimits[difficulty];
    let score = baseScore[difficulty];
    if(durationMs <= target) {
        score+=Math.round(baseScore[difficulty]*0.5);
    }else if(durationMs <max){
        const ratio = 1- (durationMs -target) / (max-target);
        score+= Math.round(baseScore[difficulty]*0.5*ratio)
    }

    return Math.round(score)
}