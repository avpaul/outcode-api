import Boom from 'boom';
import mongoose from 'mongoose';

const Post = mongoose.model('Post');

export default {
  getOldVersion: (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      next(Boom.badRequest('id not found'));
    }
    Post.findOne({ id }).then((p) => {
      res.status(200)
        .json(p);
    });
  },

  publish: (req, res, next) => {
    const status = req.query.status || '';
    const { cookies } = req.cookies;
    const id = Number(cookies.editingPostID);

    if (status === '') {
      next(Boom.badRequest('status not found'));
    }
    if (!id) {
      next(Boom.badRequest('id not found'));
    }

    Post.findOneAndUpdate(id, { status: 'published' })
      .then(() => {
        res.cookie('editingPostID', '');
        res.status(200).json({
          status: res.statusCode,
          message: {
            published: true,
            id,
          },
        });
      })
      .catch((err) => {
        next(err);
      });
  },

  hide: (req, res, next) => {
  },

  delete: (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      next(Boom.badRequest('id not found'));
    }
    Post.deleteOne({ id }).then(() => {
      res.status(200);
      res.json({
        status: res.statusCode,
        message: 'post deleted successfully',
      });
    });
  },
};
