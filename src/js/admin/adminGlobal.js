'use strict';
import M from '../../vendorjs/materialize.min';
// import ClassicEditor from '.../vendorjs/ckeditor';
// import MaterialDateTimePicker from 'material-datetime-picker';
// import ArticleEditor from './articleEditor';
// import CookieReader from './cookieReader';


function _cacheUI() {
    let cache = {
        sidenav: $('.sidenav#sidenav-admin'),
        sidenavTrigger: $('.sidenav-trigger'),
        // cookieModal: $('#cookies-conset'),
        // cookieAgree: $('.cookies-consent-agree'),
        // cookieDisagree: $('.cookies-consent-disagree')
    }
    return cache;
}

(function init() {
    let cache = _cacheUI();

    // Initialise Materialize
    M.Sidenav.init(cache.sidenav, { draggable: false, onOpenStart: _openStart, onCloseEnd: _closeStart })

    function _openStart(e) {
        cache.sidenavTrigger.removeClass('mdi-arrow-right').addClass('mdi-arrow-left');
        e.classList.add('opened')
    }

    function _closeStart(e) {
        cache.sidenavTrigger.removeClass('mdi-arrow-left').addClass('mdi-arrow-right');
        e.classList.remove('opened')
    }
})()