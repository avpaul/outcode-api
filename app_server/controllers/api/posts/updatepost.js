import Boom from 'boom';
import mongoose from 'mongoose';

const Post = mongoose.model('Post');

const updatePost = (req, res, next) => {
  const b = req.body;
  const u = req.payload.email;
  // var s = req.query.status || 'editing';
  const { id } = req.query;

  const bs = JSON.parse(b.postSettings) || {};

  if (u === '') {
    next(Boom.badRequest('author not found'));
  }

  const getDate = m => new Date(`${m.year}-${m.month}-${m.day}T${m.hour}:${m.minute}`);

  const p = {
    title: bs.title,
    author: u,
    category: bs.category,
    stickOnFront: bs.stickOnFront || false,
    pendingReview: bs.pendingReview || false,
    tags: bs.tags || [],
    shareOn: bs.shareOn || [],
    excerpt: bs.excerpt || '',
    publicationDate: getDate(bs.publicationDate) || new Date(),
    featuredImage: bs.featuredImage || '',
    content: b.editorData,
    wordCount: bs.wordCount || 0,
  };

  Post.findOneAndUpdate({ id }, p)
    .then((old) => {
      res.status(200);
      res.json({
        id: old.id,
        old,
      });
    })
    .catch((err) => {
      next(err);
    });
};

export default updatePost;
