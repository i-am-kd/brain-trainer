import { Router } from "express";
import { AIController } from "./ai.controller.js";
import { adminOnly } from "../../middleware/adminMiddleware.ts";


const router = Router();

// router.post('/generate', AIController.generateContent);
router.post('/generate', adminOnly, AIController.generateContent);



export default router;