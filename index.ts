import express from "express";
import mongoose from "mongoose";
import { userRouter } from "./routes/authorization";
import dotenv from "dotenv";
import { contentRouter } from "./routes/content";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Simple health endpoint to verify server and DB status
app.get('/health', (_req, res) => {
    const states: Record<number, string> = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
    };
    res.status(200).json({
        status: "OK",
        db: states[mongoose.connection.readyState] ?? "unknown",
        timestamp: new Date().toISOString()
    });
});
app.use('/api/v1/', userRouter);
app.use('/api/v1/', contentRouter);

const PORT = process.env.PORT || 2099;

const mongoUri = process.env.MONGO_URI || "";

try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
} catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
}

app.listen(PORT, (): void => {
    console.log(`Server running on port ${PORT}`);
});