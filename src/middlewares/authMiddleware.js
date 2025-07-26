import createHttpError from "http-errors";
import User from "../models/User.js";
import Session from "../models/session.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            throw createHttpError(401, 'Unauthorized');
        }

        // Пошук сесії по accessToken
        const session = await Session.findOne({ accessToken: token });
        if (!session) {
            throw createHttpError(401, 'Invalid access token');
        }
        if (session.accessTokenValidUntil < new Date()) {
            await Session.deleteOne({ _id: session._id });
            throw createHttpError(401, 'Access token expired');
        }

        const user = await User.findById(session.userId);
        if (!user) {
            throw createHttpError(401, 'User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;