import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import mongoose from "mongoose";
import { TodoModel, ITodo } from "../../models/Todo";
import { RequestInterface } from "../../interfaces/request";
import { addEmailToQueue, addDummyToQueue } from "../../queues/bull";

export const createTodo = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const todo: ITodo = <ITodo>request.payload;

        const newTodo: ITodo = await TodoModel.create(todo);

        await addEmailToQueue(newTodo);

        await addDummyToQueue(newTodo);

        return h.response(newTodo).code(201);
    } catch (error) {
        return h.response(error).code(500);
    }
};

export const getAllTodos = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 5;
        const skip = (page - 1) * limit;

        const todos = await TodoModel.find({}).skip(skip).limit(limit);
        const count = await TodoModel.count();

        return h.response({
            todos,
            items: todos.length,
            limit: limit,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        return h.response(error).code(500);
    }
};

export const getTodoById = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const todoId = request.params.id;

        const isValid = mongoose.Types.ObjectId.isValid(todoId);

        if (!isValid) {
            return h.response({ msg: "TodoId is invalid" }).code(400);
        }

        const todo = await TodoModel.findById(todoId);

        if (!todo) {
            return h.response({ msg: "Todo not found" }).code(404);
        }

        return h.response(todo).code(200);
    } catch (error) {
        return h.response(error).code(500);
    }
};

export const deleteTodo = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const todoId = request.params.id;

        const isValid = mongoose.Types.ObjectId.isValid(todoId);

        if (!isValid) {
            return h.response({ msg: "TodoId is invalid" }).code(400);
        }

        const todo = await TodoModel.findOneAndRemove({
            _id: todoId,
        });

        if (!todo) {
            return h.response({ msg: "Todo not found" }).code(404);
        }

        return h.response().code(204);
    } catch (error) {
        return h.response(error).code(500);
    }
};

export const updateTodo = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const todoId = request.params.id;

        const isValid = mongoose.Types.ObjectId.isValid(todoId);

        if (!isValid) {
            return h.response({ msg: "TodoId is invalid" }).code(400);
        }

        const todo = await TodoModel.findOneAndUpdate(
            {
                _id: todoId,
            },
            <ITodo>request.payload,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!todo) {
            return h.response({ msg: "Todo not found" }).code(404);
        }

        return h.response(todo).code(200);
    } catch (error) {
        return h.response(error).code(500);
    }
};
