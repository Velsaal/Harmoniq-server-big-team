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

// Article model

import { model, Schema } from 'mongoose';


const articlesSchema = new Schema(
  {
    img: {
      type: String,
      required: true,
        },
      
    title : {
      type: String,
      required: true,
        },
    
    desc: {
      type: String,
      required: true,
        },
    
    name: {
      type: String,
      required: true,
        },
    
    article: {
      type: String,
      required: true,
        },
    
    rate: {
       type: Number,
       default: 0,
        },
    
    date: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
    },
      
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ArticlesCollection = model('articles', articlesSchema);
