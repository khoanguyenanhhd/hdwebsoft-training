import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
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

        // Return 409 when another user is editing
        if (
            event.lockedBy.toString() !== userId &&
            event.lockedExp > new Date()
        ) {
            return h
                .response({ msg: "Another user is editing this event" })
                .code(409);
        }

        const lockedAt = new Date();
        const lockedExp = new Date(lockedAt);
        lockedExp.setMinutes(lockedExp.getMinutes() + 5);

        const updateEvent = await EventModel.findOneAndUpdate(
            {
                _id: eventId,
            },
            {
                lockedBy: userId,
                lockedAt: lockedAt,
                lockedExp: lockedExp,
            },
            { new: true }
        );

        return h.response(updateEvent!).code(200);
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

        // Locked by another user and over time
        if (
            event.lockedBy.toString() !== userId &&
            event.lockedExp < new Date()
        ) {
            return h
                .response({
                    msg: "Need to access before releasing",
                })
                .code(400);
        }

        // Locked by another user and still in time
        if (
            event.lockedBy.toString() !== userId &&
            event.lockedExp > new Date()
        ) {
            return h
                .response({
                    msg: "Can not release because the access belong to another user",
                })
                .code(400);
        }

        // Locked by current user and over time
        if (
            event.lockedBy.toString() === userId &&
            event.lockedExp < new Date()
        ) {
            return h
                .response({
                    msg: "Can not release because your access is over time",
                })
                .code(400);
        }

        // Locked by current user and still in time
        const lockedExp = new Date();
        await EventModel.updateOne(
            {
                _id: eventId,
            },
            {
                lockedExp: lockedExp,
            }
        );

        return h.response().code(204);
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

        // Locked by another user and over time
        if (
            event.lockedBy.toString() !== userId &&
            event.lockedExp < new Date()
        ) {
            return h
                .response({
                    msg: "Need to access before maintain",
                })
                .code(400);
        }

        // Locked by another user and still in time
        if (
            event.lockedBy.toString() !== userId &&
            event.lockedExp > new Date()
        ) {
            return h
                .response({
                    msg: "Can not maintain because the access belong to another user",
                })
                .code(400);
        }

        // Locked by current user and over time
        if (
            event.lockedBy.toString() === userId &&
            event.lockedExp < new Date()
        ) {
            return h
                .response({
                    msg: "Can not maintain because your access is over time",
                })
                .code(400);
        }

        // Locked by current user and still in time
        const updateEvent = await EventModel.findOneAndUpdate(
            {
                _id: eventId,
            },
            {
                lockedExp: new Date(),
            },
            { new: true }
        );

        return h.response(updateEvent!).code(200);
    } catch (error) {
        return h.response(error).code(500);
    }
};
