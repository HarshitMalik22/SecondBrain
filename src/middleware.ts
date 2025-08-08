import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";

export const userMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    const header = req.headers["authorization"];
    const decoded  = jwt.verify(header as string, JWT_PASSWORD);
    if (decoded){
        req.userId: any = (decoded as { id: string }).id;
    } else {
        res.status(403).json({
            message:"You are not logged in"
        })
    }
}