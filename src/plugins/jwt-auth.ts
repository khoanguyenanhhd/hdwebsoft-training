import { ResponseToolkit } from "@hapi/hapi";
import { RequestInterface } from "../interfaces/request";
import { UserModel } from "../models/User";

const validateUser = async (
    decoded: any,
    request: RequestInterface,
    h: ResponseToolkit
) => {
    // The "lean" keyword
    // return a javascript object instead mongoose document
    // because we only check is user exist to authenticate
    // and dont need to use any properties of a mongoose document
    const user = await UserModel.findById(decoded.id).lean(true);

    if (!user) {
        return { isValid: false };
    }

    return { isValid: true };
};

export const authStrategyOptions = {
    key: process.env.JWT_SECRET,
    validate: validateUser,
    verifyOptions: {
        algorithms: ["HS256"],
    },
};
