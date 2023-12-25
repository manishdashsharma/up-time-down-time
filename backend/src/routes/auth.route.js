import { Router } from "express";
import { signUp ,getProfile, login, logout, updateUserAddress,  updateProfileImage } from "../controllers/auth.controller.js";
import {  isLoggedIn } from "../middlewares/auth.middleware.js";


const router = Router()

router.post("/signup", signUp)
router.post("/login", login)
router.get("/logout", isLoggedIn ,logout)
router.get("/profile", isLoggedIn, getProfile)
router.put("/update-address",isLoggedIn,updateUserAddress)
router.put("/update-profile-image",isLoggedIn, updateProfileImage)

export default router;