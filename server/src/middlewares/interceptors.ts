import { Request, Response } from "express";

const handleEmit = (req: Request, res: Response) => {
    const emitData = req.body.res;
    const code = emitData.code;
    delete emitData.code;
    res.status(code).send(emitData);
};

export default { handleEmit };
