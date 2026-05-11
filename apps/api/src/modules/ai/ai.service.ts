import { GoogleGenAI } from "@google/genai";
import { AIGenerationRequest, StoredSequence } from "@brain-trainer-game/types";
import { WordSequence } from "../../db/models/wordSequence.ts";

const GenAI = new GoogleGenAI({});

export const AIService = {
    async generateAndStore(req: AIGenerationRequest): Promise<StoredSequence[]>{
      const model = 'gemini-3-flash-preview';

      const contents = `You are a professional educational content generator.
      Generate ${req.count} unique word sequences related to the topic: "${req.topic}".
      
      Constraints:
      1. Each sequence must have exactly ${req.wordsPerSequence} words.
      2. Difficulty level: ${req.difficulty}.
      3. Words should be appropriate for a memory training game.
      
      Output Format:
      Return ONLY a valid JSON array of objects. Do not include markdown code blocks (like \`\`\`json) or any extra text.
      Example format:
      [
        { "words": ["apple", "banana", "cherry"], "difficulty": "easy" },
        { "words": ["quantum", "physics", "theory"], "difficulty": "hard" }
      ]`;

      try{
        const response= await GenAI.models.generateContent({model, contents});
        let text = response.text;
        if (!text || text.trim().length===0){
          throw new Error ("AI generated empty!, try agian.")
        }
       const cleanedText = text.replaceAll('```json', "").replaceAll('```', "").trim();

        const generatedData = JSON.parse(cleanedText) as Partial<StoredSequence>[];
        //validate and save the data 
        const savedSequence = await Promise.all(
          generatedData.map(async (seq) =>{
            if(!seq.words || !Array.isArray(seq.words)) return null;
            const newSeq = new WordSequence({
              words: seq.words,
              difficulty: req.difficulty,
              topic: req.topic,
              isActive: true,
            });

            return await newSeq.save();
          })
        );

        return savedSequence.filter((s): s is NonNullable<typeof s> => s !== null).map(doc=>({
          _id: doc._id.toString(),
          words: doc.words,
          difficulty: doc.difficulty,
          topic: doc.topic,
          isActive: doc.isActive,
        })) as StoredSequence[];
      }catch(error){
        console.error("AI generation Error:", error);
        throw new Error("Failed to generated sequence from AI");
      }
    }
}
