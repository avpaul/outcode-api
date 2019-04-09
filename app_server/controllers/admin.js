export default {
  metrics: (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200);
    res.render('./admin/metrics', { title: 'AvPaul blog metrics' });
  },
  comments: (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.render('./admin/comments', { title: '' });
  },
};
