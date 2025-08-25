import { Router } from "express";
import { middleware } from "./middleware";
import { contentModel } from "../db";

export const contentRouter = Router();

contentRouter.post('/content', middleware, async (req, res) => {
    try {
        const title = req.body.title;
        const link = req.body.link;

        await contentModel.create({
            title: title,
            link: link,
            // @ts-ignore
            userid: req.username,
            tags: []
        })

        return res.status(200).json({
            msg: "Successful",
        })

    } catch (error) {
        res.status(500).json({
            msg: "Some content error",
            er: error
        })
    }
})

contentRouter.get('/content', middleware, async (req, res) => {
    try {
        // @ts-ignore
        const userid = req.username

        const content = await contentModel.find({
            userid: userid,
        }).populate("userid", "username")

        return res.status(200).json({
            content
        })

    } catch (error) {
        res.status(500).json({
            msg: "Some getting content error",
            er: error
        })
    }
})

contentRouter.delete('/content', middleware, async (req, res) => {
    try {
        const title = req.body.title;
        
        await contentModel.deleteMany({
            title: title,
            // @ts-ignore
            userid: req.username
        })

        res.json({
            msg: "success"
        })
        
    } catch (error) {
        res.status(500).json({
            msg: "Some deleting error",
            er: error
        })
    }
})