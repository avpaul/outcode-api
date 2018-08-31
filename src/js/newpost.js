'use strict';
import M from '../vendorjs/materialize.min';
import ClassicEditor from '../vendorjs/ckeditor';
import MaterialDateTimePicker from 'material-datetime-picker';
import ArticleEditor from './articleEditor';

let cache = {
    editor: $('#editor')[0],
    sidenavTrigger: $('.sidenav'),
    htmlTab: $('.tab>.viewHTML'),
    htmlContainer: $('.editor-html-view'),
    closeEdit: $('.edit-close'),
    previewEdit: $('.edit-preview'),
    publishEdit: $('.edit-publish'),
    postTitle: $('.post-title'),
    deleteEdit: $('.edit-delete'),
    wordCount: $('.editor-status-wordcount'),
    lastSave: $('.editor-status-save'),
    editStatus: $('.edit-status-save'),
    datePicker: $('.datepickerdropdown-trigger'),
    dateContainer: $('.schedule-time'),
    datepickerDropDown: $('.c-datepicker-container'),
    stickFront: $('#post-frontPage'),
    pendingReview: $('#post-pendingReview'),
    category_bsns: $('#category-business'),
    category_tech: $('#category-tech'),
    category_others: $('#category-others'),
    category: $('.post-categories'),
    tags: $('.chips.chips-placeholder'),
    featuredImg: $('.featured-image'),
    featuredImgUploader: $('.featured-img-uploader'),
    featuredImgUploaderBtn: $('.featured-img-uploader-btn'),
    shareOn_facebook: $('#postShare-facebook'),
    shareOn_twitter: $('#postShare-twitter'),
    shareOn_insta: $('#postShare-instagram'),
    shareOn: $('.postShare'),
    postExcerp: $('.post-excerpt')
};
let postEditor = new ArticleEditor(cache, M, ClassicEditor, MaterialDateTimePicker);
postEditor.init();




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