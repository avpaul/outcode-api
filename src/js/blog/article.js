import { debounceTime, skipWhile } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import CookieReader from '../cookieReader';
$(document).ready(function() {

    let _this = {};

    function _cacheUI() {
        let cache = {
            commentAuthor: $('.comment-author_input'),
            textarea: $('.comment-textarea'),
            addCommentBtn: $('.add-comment'),
            commentsCont: $('.comments'),
            articleTop: $('.article-content'),
            articleBottom: $('h2+.suggested-articles'),
            progessBar: $('.progress .determinate'),
            likeBtn: $('#article-like'),
            likecounter: $('.article-like_counter')
        }
        return cache;
    }

    function _saveComment(d) {
        let url = 'http://localhost:3000/comments/new';
        let id = CookieReader.getItem('bpid');

        let o = $.post({
            url: url,
            data: {
                id: id,
                comment: JSON.stringify(d)
            },
            success: 'null',
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded'
        });
        o.then(r => {
            if (r.saved && r.saved === true) {
                this.cache.textarea.val('');
                this.cache.commentAuthor.val('');
                let ctemplate = `<div class="card comment">
                                 <div class="card-title">
                                 <span class="comment-author">${d.name}</span>
                                 <span class="comment-publish-date">${new Date(Date.now()).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'2-digit'})}</span></div>
                                 <div class="card-content comment-content">${d.content}</div>
                                 <div class="card-action">
                                 <button class="btn-icon comment-replies">2 replies<i class="mdi mdi-chevron-down"></i></button>
                                 </div></div>`;
                $(ctemplate).prependTo(this.cache.commentsCont);
            }

        }).catch(err => {
            console.log(err);
        });
    }

    function _readProgress() {
        let _this = this;
        let _c = _this.cache;
        let l, o, v, b = 0;
        b = _c.articleBottom.outerHeight(true);
        l = _c.articleTop.outerHeight(true) - b;
        o = _c.articleTop.offset().top;

        let _so = fromEvent(window, 'scroll').pipe(
            debounceTime(100),
            skipWhile(e => $(window).scrollTop() < o));

        _so.subscribe(e => {
            window.requestAnimationFrame(() => {
                v = (($(window).scrollTop() - o) / l) * 100;
                _c.progessBar.width(`${v}%`);
            })
        })

        $(window).on('resize', () => {
            v = 0;
            l = _c.articleTop.outerHeight(true) - b;
        });
    }

    function _bindUI() {
        let _this = this;
        let c = _this.cache;
        c.addCommentBtn.on('click', () => {
            let name = c.commentAuthor.val() || '';
            let content = c.textarea.val() || '';
            if (name === '') {
                return;
            } else if (content === '') {
                return;
            }
            _this._saveComment.call(_this, { name: name, content: content })
        })
    }

    function init() {
        let cache = _cacheUI();
        Object.defineProperties(_this, {
            cache: {
                value: cache
            },
            _saveComment: {
                value: _saveComment
            },
            _readProgress: {
                value: _readProgress
            }
        });
        _bindUI.call(_this);
        _this._readProgress.call(_this);
    }
    init();
})

if (module.hot) {
    module.hot.accept()
}