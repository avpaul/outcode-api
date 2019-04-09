import Boom from 'boom';
import Post from '../backend/post';

export default {
  get: (req, res, next) => {
    const done = (p) => {
      res.setHeader('Content-Type', 'text/html');
      renderPosts(res, p);
    };
    Post.getNPost(null, 10, next, done);

    function renderPosts(res, ps) {
      // pos:{title:string,featuredImg:string,id:number}
      const posts = [];
      posts.forEach((post) => {
        posts.push({
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
        posts,
      });
    }
  },

  getNew: (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.cookie('isPostUpdate', '', { maxAge: 0 });
    res.cookie('editingPostID', '', { maxAge: 0 });
    res.render('./admin/newpost', { title: 'New post' });
  },

  getUpdate: (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      next(Boom.badRequest('id not found'));
    }
    const done = function (p) {
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
    };
    post.getOnePost({ id }, next, done);
  },

  getOldVersion: (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      next(Boom.badRequest('id not found'));
    }
    post.getOnePost({ id }, next, (p) => {
      res.status(200)
        .json(p);
    });
  },

  preview: (req, res, next) => {
    let { id } = req.query;
    if (!Number.isInteger(id)) {
      id = Number(id);
    }

    post.getOnePost({ id }, next, (r) => {
      post.getNPost({ id: { $ne: id } }, 2, next, (r2) => {
        res.setHeader('Content-Type', 'text/html');
        res.render('./blog/blog', {
          title: r.title,
          post: r,
          next: r2,
        });
      });
    });
  },

  publish: (req, res, next) => {
    const s = req.query.status || '';
    const c = req.cookies;
    const id = Number(c.editingPostID);
    let u;

    if (s === '') {
      next(Boom.badRequest('status not found'));
    }
    if (!id) {
      next(Boom.badRequest('id not found'));
    }

    post.publish(id, next, (p) => {
      res.cookie('editingPostID', '');
      res.status(response.statusCode);
      res.json({
        published: true,
        id,
      });
    });
  },

  hide: (req, res, next) => {

  },

  mdelete: (req, res, next) => {
    const { id } = req.query;
    if (!id) {
      next(Boom.badRequest('id not found'));
    }
    post.deletePost(id, next, (p) => {
      res.status(200);
      res.json(p);
    });
  },


};

function _getDate(m) {
  if (m) {
    return new Date(`${m.year}-${m.month}-${m.day}T${m.hour}:${m.minute}`);
  }
}
