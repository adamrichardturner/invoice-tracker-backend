import morgan, { StreamOptions } from "morgan";
import { Request, Response } from "express";

morgan.token("response-body", (req: Request, res: Response) => {
    return res.locals.body ? JSON.stringify(res.locals.body) : "";
});

const stream: StreamOptions = {
    write: (message) => console.log(message.trim()),
};

const format =
    ":method :url :status :res[content-length] - :response-time ms :response-body";

const logger = morgan(format, { stream });

export default logger;
