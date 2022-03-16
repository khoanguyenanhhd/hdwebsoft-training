import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { TodoModel, ITodo } from "../../models/Todo";
import { RequestInterface } from "../../interfaces/request";
import { addEmailToQueue } from "../../queues/bull";
import { isMongooseObjectId } from "../../utils/helper";

export const createTodo = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const todo = <ITodo>request.payload;
        const userId = request.auth.credentials.id;

        todo.createdBy = userId;

        // console.log(request.auth);

        const newTodo: ITodo = await TodoModel.create(todo);

        await addEmailToQueue(newTodo);

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
        const userId = request.auth.credentials.id;

        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 5;
        const skip = (page - 1) * limit;

        const todos = await TodoModel.find({ createdBy: userId })
            .skip(skip)
            .limit(limit);
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
        const userId = request.auth.credentials.id;

        if (!isMongooseObjectId(todoId)) {
            return h.response({ msg: "TodoId is invalid" }).code(400);
        }

        const todo = await TodoModel.findOne({
            _id: todoId,
            createdBy: userId,
        });

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
        const userId = request.auth.credentials.id;

        if (!isMongooseObjectId(todoId)) {
            return h.response({ msg: "TodoId is invalid" }).code(400);
        }

        const todo = await TodoModel.findOneAndRemove({
            _id: todoId,
            createdBy: userId,
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
        const userId = request.auth.credentials.id;

        if (!isMongooseObjectId(todoId)) {
            return h.response({ msg: "TodoId is invalid" }).code(400);
        }

        const todo = await TodoModel.findOneAndUpdate(
            {
                _id: todoId,
                createdBy: userId,
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
