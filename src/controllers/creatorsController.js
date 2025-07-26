import User from '../models/User.js';

export const getTopCreators = async (req, res, next) => {
  try {
    const creators = await User.find({}, 'name avatarUrl articlesAmount').limit(6);
    res.json(creators);
  } catch (error) {
    next(error);
  }
};
