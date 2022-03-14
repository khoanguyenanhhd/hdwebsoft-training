import * as Bcrypt from "bcryptjs";
import { IUser } from "../models/User";
import * as Jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
    const salt = await Bcrypt.genSalt(10);
    const passwordHash = await Bcrypt.hash(password, salt);
    return passwordHash;
};

export const generateToken = (user: IUser) => {
    const jwtSecretKey = process.env.JWT_SECRET;
    const jwtExpiration = process.env.JWT_LIFETIME;

    const payload = {
        id: user._id,
    };

    return Jwt.sign(payload, jwtSecretKey!, {
        expiresIn: jwtExpiration,
    });
};

export const decodeToken = (token: string) => {
    return Jwt.decode(token);
};
