import { Request } from "express";
import { IResponse } from "../interfaces";

export interface IRegisterController extends Request {
    body: {
        email: string;
        name: string;
        role: string | undefined;
        res: IResponse;
    };
}
