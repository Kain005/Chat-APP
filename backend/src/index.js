import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB} from "./lib/db.js"
import bcrypt from "bcryptjs"
import cookieParser from "cookie-parser";
import cors from"cors"
import { app,server } from "./lib/socket.js"
import path from "path"
dotenv.config()
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));



app.use(express.json()); //allows req.body and return data in json format
app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if (process.env.NODE_ENV === "production") {
    const frontendDist = path.join(process.cwd(), "frontend", "dist");
    console.log("Serving static files from:", frontendDist);
    app.use(express.static(frontendDist));
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

server.listen(PORT,()=>{
console.log("Server is running on PORT=" + PORT);
 connectDB();
}
)