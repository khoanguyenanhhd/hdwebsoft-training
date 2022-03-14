import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import mongoose from "mongoose";
import { RequestInterface } from "../../interfaces/request";
import { EventModel } from "../../models/Event";
import { IVoucher, VoucherModel } from "../../models/Voucher";
import * as uuid from "uuid";

export const createVoucher = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const eventId = request.params.id;
        const { email } = <IVoucher>request.payload;

        const isValid = mongoose.Types.ObjectId.isValid(eventId);
        if (!isValid) {
            return h.response({ msg: "EventId is invalid" }).code(400);
        }

        const event = await EventModel.findById(eventId).session(session);
        if (!event) {
            return h.response({ msg: "Event not found" }).code(400);
        }

        if (event.maxQuantity > 0) {
            const voucher = await VoucherModel.create(
                [
                    {
                        code: uuid.v4(),
                        event: eventId,
                        email: email,
                    },
                ],
                { session: session }
            );

            event.maxQuantity = event.maxQuantity - 1;
            await event.save({ session: session });

            await session.commitTransaction();

            return h.response(voucher).code(201);
        }

        console.log("No more voucher");
        return h.response({ msg: "Voucher out of stock" }).code(459);
    } catch (error) {
        await session.abortTransaction();
        return h.response(error).code(500);
    } finally {
        session.endSession();
    }
};
