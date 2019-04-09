import Boom from 'boom';

const updatePost = (req, res, next) => {
  const b = req.body;
  const u = req.payload.email;
  // var s = req.query.status || 'editing';
  const { id } = req.query;
  let bs;

  bs = JSON.parse(b.postSettings) || {};

  if (u === '') {
    next(Boom.badRequest('author not found'));
  }
  const p = {
    title: bs.title,
    author: u,
    category: bs.category,
    stickOnFront: bs.stickOnFront || false,
    pendingReview: bs.pendingReview || false,
    tags: bs.tags || [],
    shareOn: bs.shareOn || [],
    excerpt: bs.excerpt || '',
    publicationDate: _getDate(bs.publicationDate) || new Date(),
    featuredImage: bs.featuredImage || '',
    content: b.editorData,
    wordCount: bs.wordCount || 0,
  };

  Post.findOneAndUpdate({ id }, p)
    .then((old) => {
      done({
        updated: true,
        id: old.id,
      });
    })
    .catch((err) => {
      next(err);
    });

  post.updatePost(id, p, next, (v) => {
    res.status(200);
    res.json(v);
  });
};

export default updatePost;
