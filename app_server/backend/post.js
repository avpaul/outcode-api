import mongoose from 'mongoose';
import Boom from 'boom';

const Post = mongoose.model('Post');

export default {
  getOnePost(condition, next, done) {
    if (!condition) {
      next(Boom.badRequest('condition not found'));
    }
    Post.findOne(condition)
      .then((p) => {
        done(p);
      })
      .catch((err) => {
        next(err);
      });
  },

  getNPost(condition, n, next, done) {
    if (condition) {
      Post.find(condition)
        .sort({ id: 'ascending' })
        .limit(n)
        .then((posts) => {
          done(posts);
        })
        .catch((err) => {
          next(err);
        });
    } else {
    // Find all
      Post.find()
        .sort({ id: 'ascending' })
        .limit(n)
        .then((posts) => {
          done(posts);
        })
        .catch((err) => {
          next(err);
        });
    }
  },

  publish(id, next, done) {
    Post.findOneAndUpdate(id, { status: 'published' })
      .then((old) => {
        done({
          updated: true,
          id: old.id,
        });
      })
      .catch((err) => {
        next(err);
      });
  },

  deletePost(id, next, done) {
    if (!Number.isInteger(id)) {
      id = Number(id);
    }
    Post.deleteOne({ id })
      .then((r) => {
        done({ deleted: true });
      })
      .catch((err) => {
        next(err);
      });
  },
};
