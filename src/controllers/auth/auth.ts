import { ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { LoginInterface, RequestInterface } from "../../interfaces/request";
import { IUser, UserModel } from "../../models/User";
import { decodeToken, generateToken } from "../../utils/helper";

export const register = async (
    request: RequestInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const payload = <IUser>request.payload;

        const user = await UserModel.findOne({
            $or: [
                {
                    email: payload.email,
                },
                {
                    username: payload.username,
                },
            ],
        });

        if (user) {
            if (user.email === payload.email) {
                return h
                    .response({
                        msg: "User already exists with this email address",
                    })
                    .code(400);
            }
            if (user.username === payload.username) {
                return h
                    .response({ msg: "User already exists with this username" })
                    .code(400);
            }
        }

        const newUser: IUser = await UserModel.create(payload);

        return h.response(newUser).code(201);
    } catch (error) {
        return h.response(error).code(500);
    }
};

export const login = async (
    request: LoginInterface,
    h: ResponseToolkit
): Promise<ResponseObject> => {
    try {
        const { username, email, password } = request.payload;

        const user = await UserModel.findOne({
            $or: [
                {
                    email: email,
                },
                {
                    username: username,
                },
            ],
        });

        if (!user) {
            return h
                .response({
                    msg: "User does not exists",
                })
                .code(404);
        }

        const isValidPassword = await user.validatePassword(password);

        if (!isValidPassword) {
            return h
                .response({
                    msg: "Password is invalid",
                })
                .code(400);
        }

        const token = generateToken(user);

        // Using decode properties in TypeScript
        const { exp } = decodeToken(token) as {
            exp: number;
        };

        return h
            .response({
                user,
                accessToken: {
                    token: token,
                    exp: new Date(exp * 1000),
                },
            })
            .code(200);
    } catch (error) {
        return h.response(error).code(500);
    }
};
