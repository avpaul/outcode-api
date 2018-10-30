var post = require('../backend/post');

module.exports.home = function(req, res, next) {
    post.getNPost(null, 10, next, (r) => {
        res.setHeader("Content-Type", "text/html");
        res.render("./blog/home", {
            title: "AvPaul",
            main: r.pop(),
            posts: r
        });
    })
};

module.exports.about = function(req, res, next) {
    res.render("./blog/about", { title: "about" });
};

module.exports.projects = function(req, res, next) {
    res.render("./blog/projects", { title: "Projects" });
};
module.exports.ressource = function(req, res, next) {
    res.render("./blog/ressources", { title: "Ressources" });
};