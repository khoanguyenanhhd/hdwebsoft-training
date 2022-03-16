import mongoose from "mongoose";

export interface IVoucher extends mongoose.Document {
    code: string;
    email: string;
    createdAt: Date;
    updateAt: Date;
}

const voucherSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide valid email",
            ],
        },
        event: {
            type: mongoose.Types.ObjectId,
            ref: "Event",
            require: true,
        },
    },
    { timestamps: true, optimisticConcurrency: true }
);

export const VoucherModel = mongoose.model<IVoucher>("Voucher", voucherSchema);
