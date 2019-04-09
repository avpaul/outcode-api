import post from '../backend/post';

export default {
  getAll: (req, res, next) => {
  },

  getOne: (req, res, next) => {
    const { id } = req.query;
    post.getOnePost({ id }, next, (r) => {
      post.getNPost({ id: { $ne: id } }, 2, next, (r2) => {
        res.cookie('bpid', r.id);
        res.setHeader('Content-Type', 'text/html');
        res.render('./blog/blog', {
          title: r.title,
          post: r,
          next: r2,
        });
      });
    });
  },

  getCategory: (req, res, next) => {
  },

  getTag: (req, res, next) => {
  },
};
