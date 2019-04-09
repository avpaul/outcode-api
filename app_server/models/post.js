import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  publicationDate: { type: Date, default: Date.now },
  content: { type: String, required: true },
  replies: { type: [CommentSchema], required: false },
});


const PostSchema = new mongoose.Schema({
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
  comments: [CommentSchema],
}, {
  discriminatorKey: 'status',
});

const Post = mongoose.model('Post', PostSchema);

const PublishedPostSchema = Post.discriminator('published', new mongoose.Schema({
  claps: { type: Number, default: 0 },
  comments: [CommentSchema],
  facebookShares: { type: Number, required: false },
  linkedinShares: { type: Number, required: false },
  instagramShares: { type: Number, required: false },
  twitterShares: { type: Number, required: false },
  readCount: { type: Number, required: false, default: 0 },
  tags: { type: [String], required: true },
  featuredImg: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: false },
}));
