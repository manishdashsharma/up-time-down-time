import { Router } from "express";
import authRoutes from "./auth.route.js"

const router = Router()

router.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "If you are seeing this then, server is !down"
    })
})
router.use("/auth", authRoutes)

export default router