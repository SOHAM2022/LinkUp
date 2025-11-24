import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import path from "path"

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import notificationRoutes from "./routes/notification.route.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? process.env.FRONTEND_URL || true // Allow any origin in production if FRONTEND_URL not set
        : "http://localhost:5173",
    credentials: true // allow frontend to send cookies
}))
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
