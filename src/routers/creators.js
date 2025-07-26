import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const creators = await User.find({}, 'name avatarUrl articlesAmount').limit(6);
    res.json(creators);
  } catch (error) {
    next(error);
  }
});
export default router;
