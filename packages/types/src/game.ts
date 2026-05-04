export type Difficulty = 'easy' | 'medium' | 'hard';

export interface WordSequence {
    id: string;
    words : string[];
    difficulty: Difficulty;
}

export interface GameSession{
    _id?: string; 
    userId: string;
    sequenceId: string;
    userInput: string[];
    isCorrect: boolean;
    score: number;
    durationMs: number;
    completedAt: Date;
}

export interface GameResult{
    sessionId: string;
    score: number; 
    feedback: string;
}

