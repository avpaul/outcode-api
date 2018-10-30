var post = require('../backend/post');
var Boom = require('boom');

module.exports.get = function(req, res, next) {
    var done = function(p) {
        res.setHeader('Content-Type', 'text/html');
        _renderPosts(res, p);
    }
    post.getNPost(null, 10, next, done);

    function _renderPosts(res, posts) {
        //pos:{title:string,featuredImg:string,id:number}
        let _p = [];
        posts.forEach(post => {
            _ps = post;
            _p.push({
                id: _ps.id,
                // author: _ps.author,
                title: _ps.title,
                excerpt: _ps.excerpt,
                featuredImage: _ps.featuredImage || ''
            })
        });
        res.status(200);
        res.render('./admin/posts', { title: 'Posts', posts: _p })
    }
}

module.exports.getNew = function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.cookie('isPostUpdate', '', { maxAge: 0 });
    res.cookie('editingPostID', '', { maxAge: 0 });
    res.render('./admin/newpost', { title: 'New post' })
}

module.exports.getUpdate = function(req, res, next) {
    var id = req.query.id;
    if (!id) {
        next(Boom.badRequest('id not found'));
    }
    var done = function(p) {
        res.setHeader('Content-Type', 'text/html');
        res.cookie('isPostUpdate', 'true');
        res.cookie('editingPostID', p.id, { maxAge: 604800000, sameSite: true });
        res.render('./admin/postUpdate', { title: 'Post update | ' + p.title, post: p });
    }
    post.getOnePost({ id: id }, next, done);
}
module.exports.getOldversion = function(req, res, next) {
    var id = req.query.id;
    if (!id) {
        next(Boom.badRequest('id not found'));
    }
    post.getOnePost({ id: id }, next, (p) => { res.status(200).json(p) });
}

module.exports.new = function(req, res, next) {
    var b = req.body;
    var s = req.query.status || 'editing';
    var bs;
    var u = req.payload.email;

    bs = JSON.parse(b.postSettings) || {};

    if (u === '') {
        next(Boom.badRequest('author not found'));
    }

    var p = {
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
        wordCount: bs.wordCount || 0
    };
    post.new(p, (s) => {
        if (s.saved === true) {
            res.cookie('editingPostID', s.id, { expires: new Date(Date.now() + 604800), sameSite: true });
            res.status(200);
            res.json(s);
        }
    });



}

module.exports.update = function(req, res, next) {
    var b = req.body;
    var u = req.payload.email;
    // var s = req.query.status || 'editing';
    var id = req.query.id;
    var bs;

    bs = JSON.parse(b.postSettings) || {};

    if (u === '') {
        next(Boom.badRequest('author not found'));
    }
    var p = {
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
        wordCount: bs.wordCount || 0
    };
    post.updatePost(id, p, next, v => {
        res.status(200);
        res.json(v)
    });
}
module.exports.preview = function(req, res, next) {
    var id = req.query.id;
    if (!Number.isInteger(id)) {
        id = Number(id);
    }

    post.getOnePost({ id: id }, next, (r) => {
        post.getNPost({ id: { $ne: id } }, 2, next, (r2) => {
            res.setHeader("Content-Type", "text/html");
            res.render("./blog/blog", {
                title: r.title,
                post: r,
                next: r2
            });
        })
    });

}
module.exports.publish = function(req, res, next) {
    var s = req.query.status || '';
    var c = req.cookies;
    var id = Number(c.editingPostID);
    var u;

    if (s === '') {
        next(Boom.badRequest('status not found'));
    }
    if (!id) {
        next(Boom.badRequest('id not found'));
    }

    post.publish(id, next, (p) => {
        res.cookie('editingPostID', '');
        res.status(response.statusCode);
        res.json({ published: true, id: id });
    });
}

module.exports.hide = function(req, res, next) {

}
module.exports.delete = function(req, res, next) {
    var id = req.query.id;
    if (!id) {
        next(Boom.badRequest('id not found'));
    }
    post.deletePost(id, next, (p) => {
        res.status(200);
        res.json(p);
    })
}

function _getDate(m) {
    if (m) {
        return new Date(`${m.year}-${m.month}-${m.day}T${m.hour}:${m.minute}`)
    }
}