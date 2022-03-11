import { ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import { RequestInterface } from "../../interfaces/request";

export const createTodoValidate = {
    options: {
        // abortEarly: true => stop validation on the first error and return only 1 error
        // abortEarly: false => return all errors found
        abortEarly: false,
    },
    payload: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
    }),
    failAction: (request: RequestInterface, h: ResponseToolkit, err: any) => {
        throw err;
    },
};

export const updateTodoValidate = {
    options: {
        // abortEarly: true => stop validation on the first error and return only 1 error
        // abortEarly: false => return all errors found
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
    failAction: (request: RequestInterface, h: ResponseToolkit, err: any) => {
        throw err;
    },
};
