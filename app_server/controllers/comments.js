import mongoose from 'mongoose';
import Boom from 'boom';

const Post = mongoose.model('Post');

export default {
  get: (req, res, next) => {
  },

  new: (req, res, next) => {
    let pid = req.body.id;
    const comment = JSON.parse(req.body.comment);
    if (!pid) {
      next(Boom.badRequest('post id not found'));
    } else if (!comment) {
      next(Boom.badRequest('comment not found'));
    }
    if (!Number.isInteger(pid)) {
      pid = Number(pid);
    }

    Post.findOne({ id: pid }, ['comments']).then((p) => {
      p.comments.push({
        author: comment.name,
        content: comment.content,
        publicationDate: new Date(Date.now()),
      });
      p.save();
      res.status(200);
      res.json({ saved: true });
    }).catch((err) => {
      console.log(err);
      next(Boom.boomify(err));
    });
  },

  update: (req, res, next) => {
  },

  reply: (req, res, next) => {
  },

  delete: (req, res, next) => {
  },
};
