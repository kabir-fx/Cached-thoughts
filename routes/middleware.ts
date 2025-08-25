import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"];
        const JWT_SECRET = process.env.JWT_SECRET || "Hekiigibinignbbn";
        
        const decodedToken = jwt.verify(token as string, JWT_SECRET)
        
        if (decodedToken) {
            // @ts-ignore
            req.username = (decodedToken).username;
            next()
        } else {
            res.status(403).json({
                msg: "Invalid Token"
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "Not signed in",
            er: error
        })
    }
}