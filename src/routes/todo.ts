import { Server } from "@hapi/hapi";
import Joi from "joi";
import {
    createTodo,
    deleteTodo,
    getAllTodos,
    getTodoById,
    updateTodo,
} from "../controllers/todo/todo";
import {
    createTodoValidate,
    updateTodoValidate,
} from "../controllers/todo/todo.validate";

export const todoRoute = (server: Server) => {
    server.route({
        method: "POST",
        path: "/todos",
        options: {
            handler: createTodo,
            auth: "jwt",
            tags: ["api", "todos"],
            description: "Create a todo",
            validate: createTodoValidate,
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "201": {
                            description: "Created todo.",
                        },
                    },
                },
            },
        },
    });

    server.route({
        method: "GET",
        path: "/todos",
        options: {
            handler: getAllTodos,
            auth: "jwt",
            tags: ["api", "todos"],
            description: "Get all todos",
            validate: {
                query: Joi.object({
                    page: Joi.number().default(1),
                    limit: Joi.number().default(5),
                }),
            },
        },
    });

    server.route({
        method: "GET",
        path: "/todos/{id}",
        options: {
            handler: getTodoById,
            auth: "jwt",
            tags: ["api", "todos"],
            description: "Get todo by id",
            validate: {
                params: Joi.object({
                    id: Joi.string().required(),
                }),
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "400": {
                            description: "TodoId is invalid.",
                        },
                        "404": {
                            description: "Todo not found.",
                        },
                        "200": {
                            description: "Todo founded.",
                        },
                    },
                },
            },
        },
    });

    server.route({
        method: "PUT",
        path: "/todos/{id}",
        options: {
            handler: updateTodo,
            auth: "jwt",
            tags: ["api", "todos"],
            description: "Update todo by id",
            validate: updateTodoValidate,
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "400": {
                            description: "TodoId is invalid.",
                        },
                        "404": {
                            description: "Todo not found.",
                        },
                        "200": {
                            description: "Updated.",
                        },
                    },
                },
            },
        },
    });

    server.route({
        method: "DELETE",
        path: "/todos/{id}",
        options: {
            handler: deleteTodo,
            auth: "jwt",
            tags: ["api", "todos"],
            description: "Delete todo by id",
            validate: {
                params: Joi.object({
                    id: Joi.string().required(),
                }),
            },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "400": {
                            description: "TodoId is invalid.",
                        },
                        "404": {
                            description: "Todo not found.",
                        },
                        "204": {
                            description: "No content.",
                        },
                    },
                },
            },
        },
    });
};
