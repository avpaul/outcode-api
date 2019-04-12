'use strict';
import M from '../vendorjs/materialize.min';
import ClassicEditor from '../vendorjs/ckeditor';
import MaterialDateTimePicker from 'material-datetime-picker';
import ArticleEditor from './articleEditor';
import CookieReader from './cookieReader';


function _cacheUI() {
    let cache = {
        editor: $('#editor')[0],
        sidenavTrigger: $('.sidenav#post-settings'),
        htmlTab: $('.tab>.viewHTML'),
        htmlContainer: $('.editor-html-view'),
        closeEdit: $('.edit-close'),
        previewEdit: $('.edit-preview'),
        publishEdit: $('.edit-publish'),
        postTitle: $('.post-title'),
        deleteEdit: $('.edit-delete'),
        genericModalYes: $('.genericModal-yes'),
        genericModalNo: $('.genericModal-no'),
        genericModalTemplate: $('.genericModal-template'),
        genericModal: $('.genericModal'),
        wordCount: $('.editor-status-wordcount'),
        lastSave: $('.editor-status-save'),
        editStatus: $('.edit-status-save'),
        datePicker: $('.datepickerdropdown-trigger'),
        dateContainer: $('.schedule-time'),
        datepickerDropDown: $('.c-datepicker-container'),
        stickFront: $('#post-frontPage'),
        pendingReview: $('#post-pendingReview'),

        category: $('.post-categories'),
        tags: $('.chips.chips-placeholder'),
        featuredImg: $('.featured-image'),
        featuredImgUploader: $('.featured-img-uploader'),
        featuredImgUploaderBtn: $('.featured-img-uploader-btn'),

        shareOn: $('.postShare'),
        postExcerp: $('.post-excerpt'),
        cookieModal: $('#cookies-conset'),
        cookieAgree: $('.cookies-consent-agree'),
        cookieDisagree: $('.cookies-consent-disagree'),
        accordion: $('.sidenav .collapsible')
    }
    return cache;
}

function _setCookies(c) {
    if (!CookieReader.hasItem('cookiesAccepted')) {
        let eTop = '30%';
        if (document.body.clientWidth > 601) {
            eTop = '60%'
        }
        let ins = M.Modal.init(c.cookieModal, { opacity: 0, dismissible: false, endingTop: eTop });
        ins[0].open();
        CookieReader.setItem('cookiesAccepted', 'true', new Date(Date.now() + 31622400).toUTCString(), '/');
        CookieReader.setItem('users.js', JSON.stringify({ name: 'avpaul', token: '', type: 'admin' }), '31536e3', '/');
        c.cookieAgree.on('click', () => {
            ins[0].close();
        });
        c.cookieDisagree.on('click', () => {
            CookieReader.setItem('users.js', '');
            CookieReader.setItem('cookiesAccepted', 'false', '/')
            ins[0].close();
            return;
        });
    } else if (CookieReader.getItem('cookiesAccepted') === true && !CookieReader.hasItem('users.js')) {
        CookieReader.setItem('users.js', JSON.stringify({ name: 'avpaul', token: '', type: 'admin' }), '31536e3', '/');
    } else if (CookieReader.getItem('cookiesAccepted') === false) {
        return
    }
}


(function init() {
    let cache = _cacheUI();
    let isUpdate = CookieReader.getItem('isPostUpdate') || false;
    let postID = CookieReader.getItem('editingPostID') || 0;
    let postEditor = new ArticleEditor(cache, M, ClassicEditor, MaterialDateTimePicker, isUpdate, postID);
    postEditor.init();
    _setCookies(cache)
})()

/** ========== WEBPACK HOT MODULE IMPLEMENTATIONS ========== **/
if (module.hot) {
    module.hot.dispose(() => {
        window.editor.destroy();
    });
    module.hot.accept();
    module.hot.accept('./articleEditor.js', () => {
        location.reload();
    });
}
// });
