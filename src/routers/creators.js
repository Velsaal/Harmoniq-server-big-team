import express from 'express';
import { getTopCreators } from '../controllers/creatorsController.js';

const router = express.Router();

router.get('/top-creators', getTopCreators);

export default router;
