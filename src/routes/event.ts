import { Server } from "@hapi/hapi";
import Joi from "joi";
import {
    accessEvent,
    createEvent,
    maintainEvent,
    releaseEvent,
} from "../controllers/event/event";
import { createEventValidate } from "../controllers/event/event.validate";
import { createVoucher } from "../controllers/voucher/voucher";
import { createVoucherValidate } from "../controllers/voucher/voucher.valiadate";

export const eventRoute = (server: Server) => {
    server.route({
        method: "POST",
        path: "/events",
        options: {
            handler: createEvent,
            auth: false,
            tags: ["api", "events"],
            description: "Create event",
            validate: createEventValidate,
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "201": {
                            description: "Created event.",
                        },
                    },
                },
            },
        },
    });

    server.route({
        method: "POST",
        path: "/events/{id}/vouchers",
        options: {
            handler: createVoucher,
            auth: false,
            tags: ["api", "events"],
            description: "Create voucher",
            validate: createVoucherValidate,
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "201": {
                            description: "Created voucher.",
                        },
                    },
                },
            },
        },
    });

    server.route({
        method: "POST",
        path: "/events/{id}/editable/me",
        options: {
            handler: accessEvent,
            auth: "jwt",
            tags: ["api", "events"],
            description: "Access event",
            validate: {
                params: Joi.object({
                    id: Joi.string().required(),
                }),
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "Event accessed.",
                        },
                        "409": {
                            description: "Can not access.",
                        },
                    },
                },
            },
        },
    });

    server.route({
        method: "POST",
        path: "/events/{id}/editable/release",
        options: {
            handler: releaseEvent,
            auth: "jwt",
            tags: ["api", "events"],
            description: "Release event",
            validate: {
                params: Joi.object({
                    id: Joi.string().required(),
                }),
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "Event released.",
                        },
                        "400": {
                            description: "Can not release.",
                        },
                    },
                },
            },
        },
    });

    server.route({
        method: "POST",
        path: "/events/{id}/editable/maintain",
        options: {
            handler: maintainEvent,
            auth: "jwt",
            tags: ["api", "events"],
            description: "Maitain event",
            validate: {
                params: Joi.object({
                    id: Joi.string().required(),
                }),
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "Event maitained.",
                        },
                        "400": {
                            description: "Can not maintain.",
                        },
                    },
                },
            },
        },
    });
};
