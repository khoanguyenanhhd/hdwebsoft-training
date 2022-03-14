import mongoose from "mongoose";

export interface IEvent extends mongoose.Document {
    name: string;
    maxQuantity: number;
    createdAt: Date;
    updateAt: Date;
}

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        maxQuantity: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    }
);

export const EventModel = mongoose.model<IEvent>("Event", eventSchema);
