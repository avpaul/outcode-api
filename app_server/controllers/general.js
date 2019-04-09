import post from '../backend/post';

export default {
  home: (req, res, next) => {
    post.getNPost(null, 10, next, (r) => {
      res.setHeader('Content-Type', 'text/html');
      res.render('./blog/home', {
        title: 'AvPaul',
        main: r.pop(),
        posts: r,
      });
    });
  },

  about: (req, res, next) => {
    res.render('./blog/about', { title: 'about' });
  },

  projects: (req, res, next) => {
    res.render('./blog/projects', { title: 'Projects' });
  },

  resource: (req, res, next) => {
    res.render('./blog/resources', { title: 'Resources' });
  },
};
