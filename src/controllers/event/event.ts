import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import mongoose from "mongoose";
import { RequestInterface } from "../../interfaces/request";
import { EventModel, IEvent } from "../../models/Event";
import { isMongooseObjectId } from "../../utils/helper";

export const createEvent = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const event = <IEvent>request.payload;

        const newEvent = await EventModel.create(event);

        return h.response(newEvent).code(201);
    } catch (error) {
        return h.response(error).code(500);
    }
};

export const accessEvent = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const eventId = request.params.id;
        const userId = request.auth.credentials.id;

        if (!isMongooseObjectId(eventId)) {
            return h.response({ msg: "EventId is invalid" }).code(400);
        }

        const event = await EventModel.findById(eventId);

        if (!event) {
            return h.response({ msg: "Event not found" }).code(404);
        }

        const session = await mongoose.startSession();
        let isLockedByAnotherUser = false;
        let isLockedByCurrentUser = false;

        try {
            const transactionResult: any = await session.withTransaction(
                async () => {
                    const eventForUpdating = await EventModel.findById(eventId);

                    if (
                        eventForUpdating.lockedBy.toString() !== userId &&
                        eventForUpdating.lockedExp > new Date()
                    ) {
                        isLockedByAnotherUser = true;
                    } else if (
                        eventForUpdating.lockedBy.toString() === userId &&
                        eventForUpdating.lockedExp > new Date()
                    ) {
                        isLockedByCurrentUser = true;
                    } else {
                        const lockedAt = new Date();
                        const lockedExp = new Date(lockedAt);
                        lockedExp.setMinutes(lockedExp.getMinutes() + 5);

                        await EventModel.updateOne(
                            { _id: eventId },
                            {
                                lockedBy: userId,
                                lockedAt: lockedAt,
                                lockedExp: lockedExp,
                            },
                            {
                                session: session,
                            }
                        );
                    }
                }
            );

            if (!transactionResult && isLockedByAnotherUser) {
                return h
                    .response({ msg: "Another user is editing this event" })
                    .code(409);
            }

            if (!transactionResult && isLockedByCurrentUser) {
                return h
                    .response({ msg: "You are currently editing this event" })
                    .code(409);
            }

            const event = await EventModel.findById(eventId);

            return h.response(event).code(200);
        } catch (error) {
            return h.response(error).code(500);
        } finally {
            session.endSession();
        }
    } catch (error) {
        return h.response(error).code(500);
    }
};

export const releaseEvent = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const eventId = request.params.id;
        const userId = request.auth.credentials.id;

        if (!isMongooseObjectId(eventId)) {
            return h.response({ msg: "EventId is invalid" }).code(400);
        }

        const event = await EventModel.findById(eventId);

        if (!event) {
            return h.response({ msg: "Event not found" }).code(404);
        }

        const session = await mongoose.startSession();
        let isLockedByAnotherUserAndOverTime = false;
        let isLockedByAnotherUserAndInTime = false;

        let isLockedByCurrentUserAndOverTime = false;

        try {
            const transactionResult: any = await session.withTransaction(
                async () => {
                    const eventForUpdating = await EventModel.findById(eventId);

                    if (
                        eventForUpdating.lockedBy.toString() !== userId &&
                        eventForUpdating.lockedExp < new Date()
                    ) {
                        isLockedByAnotherUserAndOverTime = true;
                    } else if (
                        eventForUpdating.lockedBy.toString() !== userId &&
                        eventForUpdating.lockedExp > new Date()
                    ) {
                        isLockedByAnotherUserAndInTime = true;
                    } else if (
                        event.lockedBy.toString() === userId &&
                        event.lockedExp < new Date()
                    ) {
                        isLockedByCurrentUserAndOverTime = true;
                    } else {
                        const lockedExp = new Date();
                        await EventModel.updateOne(
                            {
                                _id: eventId,
                            },
                            {
                                lockedExp: lockedExp,
                            },
                            {
                                session: session,
                            }
                        );
                    }
                }
            );

            if (!transactionResult && isLockedByAnotherUserAndOverTime) {
                return h
                    .response({ msg: "Need to access before releasing" })
                    .code(400);
            }

            if (!transactionResult && isLockedByAnotherUserAndInTime) {
                return h
                    .response({
                        msg: "Can not release because the access belong to another user",
                    })
                    .code(400);
            }

            if (!transactionResult && isLockedByCurrentUserAndOverTime) {
                return h
                    .response({
                        msg: "Can not release because your access is over time",
                    })
                    .code(400);
            }

            return h.response().code(204);
        } catch (error) {
            return h.response(error).code(500);
        } finally {
            session.endSession();
        }
    } catch (error) {
        return h.response(error).code(500);
    }
};

export const maintainEvent = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const eventId = request.params.id;
        const userId = request.auth.credentials.id;

        if (!isMongooseObjectId(eventId)) {
            return h.response({ msg: "EventId is invalid" }).code(400);
        }

        const event = await EventModel.findById(eventId);

        if (!event) {
            return h.response({ msg: "Event not found" }).code(404);
        }

        const session = await mongoose.startSession();
        let isLockedByAnotherUserAndOverTime = false;
        let isLockedByAnotherUserAndInTime = false;

        let isLockedByCurrentUserAndOverTime = false;

        try {
            const transactionResult: any = await session.withTransaction(
                async () => {
                    const eventForUpdating = await EventModel.findById(eventId);

                    if (
                        eventForUpdating.lockedBy.toString() !== userId &&
                        eventForUpdating.lockedExp < new Date()
                    ) {
                        isLockedByAnotherUserAndOverTime = true;
                    } else if (
                        eventForUpdating.lockedBy.toString() !== userId &&
                        eventForUpdating.lockedExp > new Date()
                    ) {
                        isLockedByAnotherUserAndInTime = true;
                    } else if (
                        event.lockedBy.toString() === userId &&
                        event.lockedExp < new Date()
                    ) {
                        isLockedByCurrentUserAndOverTime = true;
                    } else {
                        const lockedExp = new Date();
                        lockedExp.setMinutes(lockedExp.getMinutes() + 5);

                        await EventModel.updateOne(
                            {
                                _id: eventId,
                            },
                            {
                                lockedExp: lockedExp,
                            },
                            {
                                session: session,
                            }
                        );
                    }
                }
            );

            if (!transactionResult && isLockedByAnotherUserAndOverTime) {
                return h
                    .response({ msg: "Need to access before maintain" })
                    .code(400);
            }

            if (!transactionResult && isLockedByAnotherUserAndInTime) {
                return h
                    .response({
                        msg: "Can not maintain because the access belong to another user",
                    })
                    .code(400);
            }

            if (!transactionResult && isLockedByCurrentUserAndOverTime) {
                return h
                    .response({
                        msg: "Can not maintain because your access is over time",
                    })
                    .code(400);
            }

            return h.response().code(204);
        } catch (error) {
            return h.response(error).code(500);
        } finally {
            session.endSession();
        }
    } catch (error) {
        return h.response(error).code(500);
    }
};
