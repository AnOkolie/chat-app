import express from "express"
import { signup,login, logout } from "../controllers/auth.controllers.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { updateProfile } from "../controllers/auth.controllers.js"
import { arcjetProtection } from "../lib/arcjet.middleware.js"

const router = express.Router()
router.use(arcjetProtection) //use protection for all methods

router.get("/test", (req,res) => res.status(200).json({message:"Test route"}))
router.post("/signup", signup)

router.post("/login",arcjetProtection,login)

router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile) //protect route is a self created function that ensures the user is authenticated before calling the function
router.get("/check",protectRoute,(req,res)=>res.status(200).json(req.user))
export default router