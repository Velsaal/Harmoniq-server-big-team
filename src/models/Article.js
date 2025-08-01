import { model, Schema } from 'mongoose';

const articleSchema = new Schema(
  {
   
    title: { type: String, required: true },
    author: { type: String, default: 'Unknown' },
    content: { type: String, default: '' },
    
    img: { type: String },
    desc: { type: String },
    name: { type: String },
    article: { type: String },
    rate: { type: Number, default: 0 },
    date: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'articles',
  }
);

const Article = model('Article', articleSchema);
export default Article;