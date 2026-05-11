import mongoose, {Schema, Document} from "mongoose";
import { StoredSequence as IStoredSequence } from "@brain-trainer-game/types";


export interface WordSequenceDocument extends Document, Omit<IStoredSequence, '_id'>{}

const WordSequenceSchema = new Schema<WordSequenceDocument>({
  words: [{ type: String, required: true }],
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  topic: {type: String},
  isActive: {type: Boolean, default: true},
    }, 
    {timestamps: true}
);

export const WordSequence = mongoose.model<WordSequenceDocument>('WordSequence', WordSequenceSchema);