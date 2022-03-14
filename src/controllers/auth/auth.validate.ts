import { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

export const registerValidate = {
    options: {
        abortEarly: false,
    },
    payload: Joi.object({
        username: Joi.string().required().trim().min(6).max(30),
        email: Joi.string()
            .required()
            .trim()
            .regex(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
        password: Joi.string().required().trim().min(6).max(30),
    }),
    failAction: (request: Request, h: ResponseToolkit, err: any) => {
        throw err;
    },
};

export const loginValidate = {
    options: {
        abortEarly: false,
    },
    payload: Joi.object({
        username: Joi.string().trim().min(6).max(30),
        email: Joi.string()
            .trim()
            .regex(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
        password: Joi.string().required().trim().min(6).max(30),
    }).xor("username", "email"),
    failAction: (request: Request, h: ResponseToolkit, err: any) => {
        throw err;
    },
};
