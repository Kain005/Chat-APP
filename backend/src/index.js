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

const __dirname=path.resolve();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));



app.use(express.json()); //allows req.body and return data in json format
app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

server.listen(PORT,()=>{
console.log("Server is running on PORT=" + PORT);
 connectDB();
}
)