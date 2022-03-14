import mongoose from "mongoose";
import { hashPassword } from "../utils/helper";
import * as Bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updateAt: Date;
    validatePassword(requestPassword: string): boolean;
}

export const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide valid email",
            ],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 30,
        },
    },
    { timestamps: true }
);

// When make a write action on database, if "Password" field is modified
// => hash the password
UserSchema.pre("save", async function (next) {
    const user: IUser = this;

    // console.log(user.isModified());

    if (!user.isModified("password")) {
        return next();
    }

    user["password"] = await hashPassword(user["password"]);

    next();
});

UserSchema.methods.validatePassword = async function (requestPassword: string) {
    const isMatch = await Bcrypt.compare(requestPassword, this.password);
    return isMatch;
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);
