import mongoose, {Schema, Types} from 'mongoose';

const GameSessionSchema = new Schema(
    {
        userId: {type: Schema.Types.ObjectId, ref:'User', required: true},
        sequenceId: {type: String, required: true},
        userInput:[{type: String}],
        isCorrect: {type: Boolean, required: true},
        score: {type: Number, required: true},
        durationMs: {type: Number, required: true},
        completedAt: {type: Date, default: Date.now}
    },
    {timestamps: true}
);


export type GameSessionDocument = mongoose.InferSchemaType<typeof GameSessionSchema> & {
    _id: Types.ObjectId;
}

export const GameSession = mongoose.model<GameSessionDocument>('GameSession', GameSessionSchema);