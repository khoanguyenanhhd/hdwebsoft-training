import { Server } from "@hapi/hapi";
import Joi from "joi";
import {
    createTodo,
    createTodoValidate,
    deleteTodo,
    getAllTodos,
    getTodoById,
    updateTodo,
    updateTodoValidate,
} from "../controllers/todo";

export const todoRoute = (server: Server) => {
    server.route({
        method: "POST",
        path: "/todos",
        options: {
            handler: createTodo,
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