import { NextFunction, Request, Response } from "express";
import { TrafficLogModel } from "../models";

const appConfig = (req: Request, res: Response, next: NextFunction) => {
    const { body, ip, method, params, query, url } = req;
    const remoteAddress = req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const startTime = new Date().getTime();
    res.on("finish", async () => {
        const endTime = new Date().getTime();
        const responseTime = endTime - startTime;
        const responseStatusCode = res.statusCode;
        const response = JSON.stringify(body.res);
        delete body.res;
        const reqLog = {
            req: {
                body: JSON.stringify(body),
                ip,
                method,
                params: JSON.stringify(params),
                query: JSON.stringify(query),
                url,
                remoteAddress,
                userAgent,
            },
            response,
            statusCode: responseStatusCode,
            duration: `${responseTime}ms`,
        };
        TrafficLogModel.create(reqLog);
    });
    next();
};

const handleEmit = (req: Request, res: Response) => {
    const emitData = req.body.res;
    const code = emitData.code;
    delete emitData.code;
    res.status(code).send(emitData);
};

export default { appConfig, handleEmit };
