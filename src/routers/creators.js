import express from 'express';
import { getTopCreators, getAllCreators } from '../controllers/creatorsController.js';
console.log("🔥 creators router loaded");

const router = express.Router();

router.get('/top-creators', getTopCreators);
router.get('/all', getAllCreators);

export default router;
