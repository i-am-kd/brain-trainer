import apiClient from "../../../lib/axios.js";
import { AIGenerationRequest } from "@brain-trainer-game/types";

export const adminApi = {
    generateContent: async (payload: AIGenerationRequest) =>{
        const {data} = await apiClient.post('/admin/ai/generate', payload);
        return data as {message: string, count: number};
    },
};