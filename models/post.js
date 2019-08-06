import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  publicationDate: { type: Date, default: Date.now },
  content: { type: String, required: true },
});

const PostSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true, min: 10 },
    author: { type: String, required: true, min: 4 },
    publicationDate: { type: Date, default: Date.now },
    category: { type: [String], required: true },
    stickOnFront: { type: Boolean, required: false, default: false },
    pendingReview: { type: Boolean, required: false, default: false },
    shareOn: { type: [String], required: false },
    wordCount: { type: Number, required: false },
    tags: { type: [String], required: false },
    featuredImage: { type: String, required: false },
    excerpt: { type: String, required: false },
    status: { type: String, required: true, default: 'editing' },
    content: { type: String, required: false },
    comments: [CommentSchema]
  },
  {
    discriminatorKey: 'status'
  }
);

mongoose.model('Post', PostSchema);
