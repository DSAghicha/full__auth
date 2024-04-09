import { Request } from "express";
import { IResponse } from "../interfaces";

export interface ILoginController extends Request {
    body: {
        email: string;
        password: string;
        res: IResponse;
    };
}

export interface IRegisterController extends Request {
    body: {
        email: string;
        name: string;
        role: string | undefined;
        res: IResponse;
    };
}
