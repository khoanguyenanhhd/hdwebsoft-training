import mongoose from "mongoose";

// Create an interface representing a document in MongoDB
export interface ITodo extends mongoose.Document {
    // Mongoose document defaut properties:
    // _id
    // __v
    name: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updateAt: Date;
}

const todoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const TodoModel = mongoose.model<ITodo>("Todo", todoSchema);
