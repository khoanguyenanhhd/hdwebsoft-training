import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { RequestInterface } from "../../interfaces/request";
import { EventModel, IEvent } from "../../models/Event";

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
