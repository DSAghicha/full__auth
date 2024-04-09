import { hash } from "bcrypt";
import { NextFunction, Response } from "express";
import { UserModel } from "../models";
import { IRegisterController } from "./authControllerTypes";

const register = async (req: IRegisterController, _: Response, next: NextFunction) => {
    try {
        const { name, email, role } = req.body;
        if (!email || !name) {
            req.body.res = { code: 206, success: false, message: "Missing one or more required detail(s)." };
            next();
            return;
        }
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            req.body.res = { code: 200, success: false, message: "E-mail address already registered!" };
            next();
            return;
        }
        const password = await hashPassword("FullAuth@2024");
        const userCreated = await UserModel.create({ name, email, password });
        req.body.res = userCreated
            ? { code: 200, success: true, message: `User ${email} created!` }
            : { code: 200, success: false, message: `Unable to create user ${email}` };
    } catch (err: any) {
        req.body.res = { code: 200, success: false, message: `Request failed: ${err.message}` };
    } finally {
        next();
    }
};

const hashPassword = async (password: string): Promise<string> => await hash(password, 10);

export default { register };
