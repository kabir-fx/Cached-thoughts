import { Router } from "express";
import { middleware } from "./middleware";

export const contentRouter = Router();

contentRouter.get('/content', middleware, (req, res) => {
    try {
        res.status(200).json({
            msg: "Successful"
        })
    } catch (error) {
        res.status(500).json({
            msg: "Some content error"
        })
    }
})