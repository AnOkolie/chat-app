import {Server} from "socket.io"
import http from "http"
import express from "express"
import {ENV} from './lib/env.js'
import { socketAuthMiddleware } from "./middleware/socket.auth.middleware.js"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {cors:{
    origin: [ENV.CLIENT_URL,],
    credentials: true
}
});

io.use(socketAuthMiddleware)

const userSocketMap = {};

//use io.on to listen initially so we can get the socket but all other calls for listening for events happen with socket.on
io.on("connection", (socket) => {
    console.log("A user connected",socket.user.fullName)
    const userId = socket.userId
    userSocketMap[userId] = socket.id

    //sends event to all connected clients using io.emit
    io.emit("getOnlineUsers", Object.keys(userSocketMap)) //takes all the keys(userId) and sends it to all the clients

    socket.on("disconnect", () => {
        console.log("A user disconnected")
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export {io,app,server}