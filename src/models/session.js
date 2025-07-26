import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const sessionSchema = new mongoose.Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    accessTokenValidUntil: {
        type: Date,
        required: true,
    },
    refreshTokenValidUntil: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

const Session = model('Session', sessionSchema);

export default Session;