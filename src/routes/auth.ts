import { Server } from "@hapi/hapi";
import { login, register } from "../controllers/auth/auth";
import {
    loginValidate,
    registerValidate,
} from "../controllers/auth/auth.validate";

export const authRoute = (server: Server) => {
    server.route({
        method: "POST",
        path: "/auth/register",
        options: {
            handler: register,
            auth: false,
            tags: ["api", "auth"],
            description: "User register",
            validate: registerValidate,
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "201": {
                            description: "Created user.",
                        },
                    },
                },
            },
        },
    });

    server.route({
        method: "POST",
        path: "/auth/login",
        options: {
            handler: login,
            auth: false,
            tags: ["api", "auth"],
            description: "User login",
            validate: loginValidate,
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "Login successfully.",
                        },
                    },
                },
            },
        },
    });
};
