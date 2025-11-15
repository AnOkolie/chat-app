import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js"
import cors from "cors";
import { ENV } from "./lib/env.js"

dotenv.config();

const app = express()
const __dirname = path.resolve()
console.log(ENV.CLIENT_URL)
const port  = process.env.PORT || 3000;

app.use(express.json({ limit: "5mb" })); //allows you to get the fields from the user 
app.use(cors({ origin:ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)
const {NODE_ENV} = process.env
    if(!NODE_ENV){
        throw new Error("NODE_ENV is not configured")
    }


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("*",(_,res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html")) //serve the index.html file for other api routes
    })
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    connectDB()
})
