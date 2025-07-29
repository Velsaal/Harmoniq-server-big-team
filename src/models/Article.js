
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: 'Unknown',
    },
    content: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'articles',
  }
);

const Article = model('Article', articleSchema);
export default Article;
