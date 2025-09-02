import { Router } from "express";
import { middleware } from "./middleware";
import { contentModel, linkModel } from "../db";
import { create_link } from "./linkGenerator";

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

// Accept POST for toggling share to avoid GET-with-body issues from browsers
contentRouter.post('/content/share', middleware, async (req, res) => {
    try {
        // @ts-ignore
        const userid = req.username;

        const share: boolean = req.body.share;
        if (share) {
            
            const existingLink = await linkModel.findOne({
                userid: userid
            })
            
            if (existingLink) {
                return res.json({
                    msg: "Sharing existing link",
                    link: existingLink.link
                })
            }
            const hashedLink = create_link(11);
            
            const shareableLink = `${userid.toString()}-${hashedLink}`

            await linkModel.create({
                userid: userid,
                link: shareableLink
            })

            return res.json({
                link: shareableLink
            })

        } else {
            await linkModel.deleteOne({
                userid: userid
            })
            
            return res.json({
                msg: "Removed Shareable link"
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "Some sharing error",
            er: error
        })
    }
})

contentRouter.get('/content/:sharelink', async (req, res) => {
    try {
        const sharelink = req.params.sharelink;
        
        const linkExists = await linkModel.findOne({
            link: sharelink
        })

        if (!linkExists) {
            res.status(403).json({
                msg: "Invalid link",
            })
        }

        const userContent = await contentModel.find({
            userid: linkExists?.userid.toString()
        })
        
        res.json({
            content: userContent
        })

    } catch (error) {
        res.status(500).json({
            msg: "Some api get error",
            er: error
        })
    }
})
