import { Schema, model, Types } from "mongoose";

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

export const userModel = model("users", userSchema);
export const contentModel = model("content", contentSchema);