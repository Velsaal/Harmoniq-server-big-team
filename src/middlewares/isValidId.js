import createError from 'http-errors';
import mongoose from 'mongoose';

export const isValidId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        next(createError(400, 'Invalid ID'));
    }
    next();
}; 