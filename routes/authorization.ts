import { Router } from "express";
import { userModel } from "./../db";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import z from "zod";
import dotenv from "dotenv";

dotenv.config();

export const userRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "Hekiigibinignbbn";

userRouter.post('/signup', async (req, res) => {
    try {
        const requiredBody = z.object({
            username: z.string().min(3).max(10),
            email: z.email().min(3).max(100),
            password: z.string().min(3).max(20)
        })
        const parsedDataOutput = requiredBody.safeParse(req.body);
        if (!parsedDataOutput.success) {
            return res.status(411).json(({
                msg: "Incorrect format"
            }))
        }
        
        const { username, email, password } = parsedDataOutput.data;

        const db_response = await userModel.findOne({
            username: username,
        })

        if (db_response) {
            res.status(403).json({
                msg: "User already exists"
            })
        } else {
            // Use a reasonable salt round to avoid blocking the event loop
            const hashedPassword = await bcrypt.hash(password, 10);

            await userModel.create({
                username: username,
                email: email,
                password: hashedPassword
            })

            res.status(200).json({
                msg: "Created user: " + username
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "Some server error"
        })
    }
})

userRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const usernameExists = await userModel.findOne({ username: username })

        if (usernameExists) {
            if (!usernameExists.password) {
                return res.status(500).json({
                    msg: "User data corrupted"
                });
            }
            
            const passwordMatch = await bcrypt.compare(password, usernameExists.password);
            
            if (passwordMatch) {
                const token = sign({
                    username: usernameExists._id.toString()
                    },
                    JWT_SECRET
                )

                res.status(200).json({
                    msg: token
                })
            } else {
                res.status(403).json({
                    msg: "Incorrect Password"
                })    
            }

        } else {
            res.status(403).json({
                msg: "User does not exist create one"
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "Some server error"
        })
    }
})