import e from "express";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 32,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 64,
    }
}, { timestamps: true });

const User = model('User', userSchema);

export default User;
