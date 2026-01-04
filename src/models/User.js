import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
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
    },
    bio: {
      type: String,
      maxlength: 1000,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '/default-avatar.jpg',
    },
    articlesAmount: {
      type: Number,
      default: 0,
    },
    savedArticles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    }],
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

const User = model('User', userSchema);
export default User;
