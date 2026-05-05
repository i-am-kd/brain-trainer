import {Router} from 'express';
import { GameController } from './game.controller.ts';

const router = Router();

router.get('/sequence', GameController.getSequence);
router.post('/submit', GameController.submitResult)

export default router;