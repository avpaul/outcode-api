var moment = require('moment');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Boom = require('boom');

module.exports.getOnePost = function(condition, next, done) {
    if (!condition) {
        next(Boom.badRequest('condition not found'));
    }
    Post.findOne(condition).then(p => {
        done(p);
    }).catch(err => {
        next(err);
    })
}

module.exports.getNPost = function(condition, n, next, done) {
    if (condition) {
        Post.find(condition).sort({ id: 'ascending' }).limit(n).then(posts => {
            done(posts)
        }).catch(err => {
            next(err);
        })
    } else {
        // Find all
        Post.find().sort({ id: 'ascending' }).limit(n).then(posts => {
            done(posts)
        }).catch(err => {
            next(err);
        })
    }
}

module.exports.new = function(p, done) {
    // Post id ==> year:2018 |month:09 |day:06 |hour:15 |indexnbr:01 => 2018 09 06 15 01 =>201809061501
    // Create a post id
    // Find the latest id from the DB
    Post.find().sort({ id: -1 }).limit(1).then(lp => {
        if (Array.isArray(lp) && lp.length !== 0) {
            p.id = Number(_createID(lp[0].id))
        } else if (Array.isArray(lp) && lp.length === 0) {
            p.id = Number(_createID(0))
        }
        // Create post in the DB
        Post.create(p).then(np => {
            done({ saved: true, id: np.id })
        }).catch(err => {
            next(err);
        })
    }).catch(err => {
        next(err);
    })
}

module.exports.updatePost = function(id, p, next, done) {
    // Update the post with the given id
    Post.findOneAndUpdate({ id: id }, p).then(old => {
        done({ updated: true, id: old.id });
    }).catch(err => {
        next(err);
    })
}

module.exports.publish = function(id, next, done) {
    Post.findOneAndUpdate(id, { status: 'published' }).then(old => {
        done({ updated: true, id: old.id })
    }).catch(err => {
        next(err);
    });
}

module.exports.deletePost = function(id, next, done) {
    if (!Number.isInteger(id)) {
        id = Number(id);
    }
    Post.deleteOne({ id: id }).then(r => {
        done({ deleted: true })
    }).catch(err => {
        next(err);
    });
}

// Post id code generetor
function _createID(latestID) {
    var id;
    var _D = moment.utc();
    var y = _D.format('YYYY');
    var m = _D.format('MM');
    var d = _D.format('DD');
    var h = _D.format('HH');
    var index = (latestID === 0) ? `0${++latestID}` : _getIndex();

    function _getIndex() {
        var _lis = latestID.toString();
        var _y = _lis.substring(0, 4);
        var _m = _lis.substring(4, 6);
        var _d = _lis.substring(6, 8);
        var _i = _lis.substring(10, 12);
        var _m = moment.utc(`${_y}-${_m}-${_d}`);
        var sameDay = moment.utc().isSame(_m, 'day');

        if (sameDay) {
            let _in = (++_i).toString();
            return (_in.length === 1) ? `0${_in}` : _in;
        } else {
            return '01'
        }
    }
    id = `${y}${m}${d}${h}${index}`;
    return id;
}