import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import mongoose from "mongoose";
import { RequestInterface } from "../../interfaces/request";
import { EventModel } from "../../models/Event";
import { IVoucher, VoucherModel } from "../../models/Voucher";
import * as uuid from "uuid";
import { addEmailToQueue } from "../../queues/bull";
import { isMongooseObjectId } from "../../utils/helper";

export const createVoucher = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const eventId = request.params.id;
        const { email } = <IVoucher>request.payload;

        if (!isMongooseObjectId(eventId)) {
            return h.response({ msg: "EventId is invalid" }).code(400);
        }

        const event = await EventModel.findById(eventId);
        if (!event) {
            return h.response({ msg: "Event not found" }).code(400);
        }

        const session = await mongoose.startSession();

        try {
            const transactionResult: any = await session.withTransaction(
                async () => {
                    const eventForUpdating = await EventModel.findById(eventId);
                    if (eventForUpdating) {
                        if (eventForUpdating.maxQuantity > 0) {
                            await VoucherModel.create(
                                [
                                    {
                                        code: uuid.v4(),
                                        event: eventForUpdating._id,
                                        email: email,
                                    },
                                ],
                                { session: session }
                            );

                            await EventModel.updateOne(
                                {
                                    _id: eventForUpdating._id,
                                },
                                {
                                    $inc: { maxQuantity: -1 },
                                },
                                {
                                    session: session,
                                }
                            );
                        }
                    }
                }
            );

            if (transactionResult) {
                const latestVoucher: IVoucher = await VoucherModel.findOne()
                    .sort({ createdAt: -1 })
                    .lean();

                await addEmailToQueue(latestVoucher);

                return h.response({ latestVoucher }).code(201);
            }

            console.log("No more voucher");
            return h.response({ msg: "Voucher out of stock" }).code(459);
        } catch (error) {
            return h.response(error).code(500);
        } finally {
            session.endSession();
        }
    } catch (error) {
        return h.response(error).code(500);
    }
};
