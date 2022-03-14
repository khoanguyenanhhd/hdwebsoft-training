import { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

export const createTodoValidate = {
    options: {
        abortEarly: false,
    },
    payload: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
    }),
    failAction: (request: Request, h: ResponseToolkit, err: any) => {
        throw err;
    },
};

export const updateTodoValidate = {
    options: {
        abortEarly: false,
    },
    params: Joi.object({
        id: Joi.string().required(),
    }),
    payload: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        completed: Joi.boolean().required(),
    }),
    failAction: (request: Request, h: ResponseToolkit, err: any) => {
        throw err;
    },
};
