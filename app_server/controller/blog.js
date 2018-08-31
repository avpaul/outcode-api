module.exports.homeCtrl = function(req, res, next) {
    res.render('./blog/home', {
        title: 'Home',
        articles: [
            { title: 'Get lean before you get mean', image: '', category: 'tecnology', date: '', id: '' },
            { title: 'How tech moved every business sector', image: '', category: 'technology', date: '', id: '' },
            { title: 'The journey of one boy to the top', image: '', category: 'business', date: '', id: '' },
            { title: 'The country side and the money kings', image: '', category: 'others', date: '', id: '' }
        ]
    });
}
module.exports.articleCtrl = function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.render('./blog/article', { title: 'The start up way: Rwanda' });
}

module.exports.demoCtrl = function(req, res, next) {
    res.render('./blog/demos', { title: 'Demos' });
}
module.exports.resCtrl = function(req, res, next) {
    res.render('./blog/ressources', { title: 'Ressources' });
}

module.exports.about = function(req, res, next) {
    res.render('./blog/about', { title: 'about' });
}