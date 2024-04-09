import { compare, hash } from "bcrypt";
import { NextFunction, Response } from "express";
import { sign } from "jsonwebtoken";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { SessionsModel, UserModel } from "../models";
import { ILoginController, IRegisterController } from "./authControllerTypes";

const login = async (req: ILoginController, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            req.body.res = { code: 206, success: false, message: "Missing one or more required detail(s)." };
            next();
            return;
        }
        if (!emailIsValid(email)) {
            req.body.res = { code: 200, success: false, message: "Invalid email address" };
            next();
            return;
        }
        const userFound = await UserModel.findOne({ email });
        if (userFound) {
            if (!(await verifyPassword(password, userFound.password))) {
                req.body.res = { code: 200, success: false, message: "Entered password is incorrect!" };
                next();
                return;
            }
            const sessions = await SessionsModel.findOne({ userId: userFound._id });
            if (!sessions) {
                await SessionsModel.create({ userId: userFound._id, sessions: [{ loginAt: new Date() }] });
            } else {
                await SessionsModel.findOneAndUpdate({ userId: userFound._id }, { $push: { sessions: { loginAt: new Date() } } });
            }
            const accessToken = sign({ email, role: userFound.roles }, ACCESS_TOKEN, { expiresIn: "1h" });
            const refreshToken = sign({ email }, REFRESH_TOKEN, { expiresIn: "1d" });
            await UserModel.findOneAndUpdate({ email }, { refreshToken });
            req.body.res = { code: 200, success: true, message: "Login successful!", data: { token: accessToken, roles: userFound.roles } };
            if (!sessions) req.body.res.data["updateDefaultPassword"] = true;
            res.cookie("RT", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
        } else {
            req.body.res = { code: 200, success: false, message: "E-mail address not registered!" };
        }
    } catch (err: any) {
        req.body.res = { code: 200, success: false, message: `Request failed: ${err.message}` };
        console.error(err);
    } finally {
        next();
    }
};

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

const emailIsValid = (email: string) => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/gi.test(email);
const passwordIsValid = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(password);
const hashPassword = async (password: string): Promise<string> => await hash(password, 10);
const verifyPassword = async (enteredPassword: string, storedPassword: string) => await compare(enteredPassword, storedPassword);

export default { login, register };
