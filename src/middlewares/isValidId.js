import createError from 'http-errors';
import mongoose from 'mongoose';

export const isValidId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        next(createError(400, 'Invalid ID'));
    }
    next();
}; 




export const isValidArticleId = (req, res, next) => {
  const id = req.params.articleId; 
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, 'Invalid ID'));
  }
  next();
};