import mongoose from 'mongoose';

const Post = mongoose.model('Post');

export default {
  getHome: async (req, res, next) => {
    // find the main article
    const mainPost = await Post.findOne({ stickOnFront: true }, 'title excerpt id featuredImage publicationDate');

    Post.find({ id: { $ne: mainPost.id } }).sort({ id: 'ascending' }).limit(10).then((posts) => {
      // pos:{title:string,featuredImg:string,id:number}
      const postsToRender = [];
      posts.forEach((post) => {
        postsToRender.push({
          id: post.id,
          // author: _ps.author,
          title: post.title,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage || '',
          publicationDate: post.publicationDate,
        });
      });
      res.setHeader('Content-Type', 'text/html');
      res.status(200);
      // list all posts on blog side
      res.render('./blog/home', {
        title: 'AvPaul',
        main: mainPost,
        posts: postsToRender,
      });
    })
      .catch(err => next(err));
  },

  getOne: (req, res, next) => {
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


  getCategory: (req, res, next) => {
  },

  getTag: (req, res, next) => {
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
