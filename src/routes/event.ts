import { Server } from "@hapi/hapi";
import { createEvent } from "../controllers/event/event";
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
};
