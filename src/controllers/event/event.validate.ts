import { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

export const createEventValidate = {
    options: {
        abortEarly: false,
    },
    payload: Joi.object({
        name: Joi.string().required(),
        maxQuantity: Joi.number().required().integer().min(0),
    }),
    failAction: (request: Request, h: ResponseToolkit, err: any) => {
        throw err;
    },
};
