import { Router } from "express";
import { AIController } from "./ai.controller.js";


const router = Router();

router.post('/generate', AIController.generateContent);


export default router;