// User model
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    avatarUrl: String,
    articlesAmount: Number,
  },
  { collection: 'users' },
);

const User = mongoose.model('User', userSchema);

export default User;
