export default {
  metrics: (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('./admin/metrics', { title: 'AvPaul blog metrics' });
  },
  comments: (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('./admin/comments', { title: '' });
  },

  login: (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('./admin/login', { title: 'Login' });
  },
  media: (req, res) => {
    res.stat(200).render('./admin/media', { title: '' });
  },
};
