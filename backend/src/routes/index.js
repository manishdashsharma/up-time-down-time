import { Router } from "express";
import authRoutes from "./auth.route.js"
import monitorRoutes from "./monitor.route.js"

const router = Router()


router.use("/auth", authRoutes)
router.use("/monitorWebsite", monitorRoutes)

export default router