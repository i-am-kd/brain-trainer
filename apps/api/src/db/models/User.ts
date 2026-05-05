import mongoose, {Schema, Types} from 'mongoose';


const UserSchema = new Schema(
    {
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true}
    },
    {timestamps: true}
);

export type UserDocument = mongoose.InferSchemaType<typeof UserSchema> &{
    _id: Types.ObjectId;
}

export const User = mongoose.model<UserDocument>("User", UserSchema);