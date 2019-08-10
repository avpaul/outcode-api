import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ArticleSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true, min: 10 },
  author: { type: String, required: true, min: 4 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  stickOnFront: { type: Boolean, required: false, default: false },
  readTime: { type: Number, required: true },
  tags: { type: [String], required: false },
  featuredImage: { type: String, required: false },
  description: { type: String, required: true },
  status: { type: String, required: true, default: 'draft' },
  content: { type: String, required: true },
  comments: [CommentSchema]
});

export default mongoose.model('Article', ArticleSchema);
