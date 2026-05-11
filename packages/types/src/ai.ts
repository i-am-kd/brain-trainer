export interface AIGenerationRequest {
    topic: string;
    count: number;
    difficulty: 'easy' | 'medium' | 'hard';
    wordsPerSequence: number;
}

export interface StoredSequence {
    _id?: string;
    words: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    topic?: string;
    isActive: boolean;

}

