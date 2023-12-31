import { Router } from "express";
import { registerWebsite, getMonitoredWebsiteByUserId, getMonitoredWebsiteById,deleteMonitoredWebsiteDataById,deleteMonitoredWebsiteDataByUserId } from "../controllers/monitor.controller.js";
import { isLoggedIn } from './../middlewares/auth.middleware.js';

const router = Router()

router.post("/", isLoggedIn, registerWebsite)
router.get("/", isLoggedIn, getMonitoredWebsiteByUserId)
router.get("/:id", isLoggedIn, getMonitoredWebsiteById)
router.delete("/:id", isLoggedIn, deleteMonitoredWebsiteDataById)
router.delete("/", isLoggedIn, deleteMonitoredWebsiteDataByUserId)

export default router;