import { Router } from 'express';
import { getProfile } from '../controllers/auth.controller.js';

const router = Router()

router.post("/test-decode-encode", getProfile)


export default router