import Boom from 'boom';
import mongoose from 'mongoose';

const Post = mongoose.model('Post');

export default {
  getPosts: (req, res, next) => {
    Post.find().sort({ id: 'ascending' }).limit(10).then((posts) => {
      // pos:{title:string,featuredImg:string,id:number}
      const postsToRender = [];
      posts.forEach((post) => {
        postsToRender.push({
          id: post.id,
          // author: _ps.author,
          title: post.title,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage || '',
        });
      });
      res.status(200);
      res.render('./admin/posts', {
        title: 'Posts',
        posts: postsToRender,
      });
    })
      .catch(err => next(err));
  },

  getNew: (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.cookie('isPostUpdate', '', { maxAge: 0 });
    res.cookie('editingPostID', '', { maxAge: 0 });
    res.stat(200).render('./admin/newpost', { title: 'New post' });
  },

  getUpdate: (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      next(Boom.badRequest('id not found'));
    }

    Post.findOne({ id }).then((p) => {
      res.setHeader('Content-Type', 'text/html');
      res.cookie('isPostUpdate', 'true');
      res.cookie('editingPostID', p.id, {
        maxAge: 604800000,
        sameSite: true,
      });
      res.render('./admin/postUpdate', {
        title: `Post update | ${p.title}`,
        post: p,
      });
    });
  },

  preview: (req, res, next) => {
    let { id } = req.query;
    if (!Number.isInteger(id)) {
      id = Number(id);
    }

    Post.findOne({ id }).then((mainPost) => {
      Post.find({ id: { $ne: id } }).sort({ id: 'ascending' }).limit(2).then((nextPosts) => {
        res.setHeader('Content-Type', 'text/html');
        res.render('./blog/blog', {
          title: mainPost.title,
          post: mainPost,
          next: nextPosts,
        });
      });
    }).catch(err => next(err));
  },
};
