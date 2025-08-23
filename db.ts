import { Schema, model } from "mongoose";

const objectId = Schema.ObjectId;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
});

const userModel = model("users", userSchema);

export { userModel };