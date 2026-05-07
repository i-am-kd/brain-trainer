import apiClient from "../../../lib/axios.js";
import { WordSequence, GameResult } from "@brain-trainer-game/types";

export const gameApi ={
    getSequence: async (): Promise<WordSequence> =>{
        const {data} = await apiClient.get('/game/sequence');
        return data;
    },

    submitResult: async (payload: {
        sequenceId: string;
        userInput: string[];
        duratonMs: number;
    }): Promise<GameResult> =>{
        const {data} = await apiClient.post('/game/submit', payload);
        return data;
    },
};
