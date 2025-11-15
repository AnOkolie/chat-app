import express from "express"
import { getAllContacts,getChatPartners,getMessagesByUserId,sendMessage } from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { arcjetProtection } from "../lib/arcjet.middleware.js"
const router = express.Router()

//router.use(arcjetProtection,protectRoute)
router.use(protectRoute)

//order matters; have the endpoints without arguments go first
router.get("/contacts", getAllContacts)
router.get("/chats", getChatPartners)
router.get("/:id",getMessagesByUserId)
router.post("/send/:id",sendMessage)

export default router