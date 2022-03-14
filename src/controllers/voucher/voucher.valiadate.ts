import { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";

export const createVoucherValidate = {
    options: {
        abortEarly: false,
    },
    params: Joi.object({
        id: Joi.string().required(),
    }),
    payload: Joi.object({
        email: Joi.string()
            .required()
            .trim()
            .regex(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
    }),
    failAction: (request: Request, h: ResponseToolkit, err: any) => {
        throw err;
    },
};
