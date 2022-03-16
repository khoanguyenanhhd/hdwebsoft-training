import mongoose from "mongoose";

export interface IEvent extends mongoose.Document {
    name: string;
    maxQuantity: number;
    createdAt: Date;
    updateAt: Date;
    lockedBy: string;
    lockedAt: Date;
    lockedExp: Date;
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
        lockedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            default: null,
        },
        lockedAt: {
            type: Date,
            default: null,
        },
        lockedExp: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    }
);

export const EventModel = mongoose.model<IEvent>("Event", eventSchema);
