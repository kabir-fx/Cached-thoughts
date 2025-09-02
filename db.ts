import { Schema, model, Types } from "mongoose";
import { string } from "zod";

const userSchema = new Schema({
    username: String,
    password: String,
});

const contentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: Types.ObjectId, ref: 'Tag'}],
    userid: {type: Types.ObjectId, ref: 'users', required: true }
})

const LinkSchema = new Schema({
    link: string,
    userid: {type: Types.ObjectId, ref: 'users', required: true }
})

export const userModel = model("users", userSchema);
export const contentModel = model("content", contentSchema);
export const linkModel = model("link", LinkSchema);