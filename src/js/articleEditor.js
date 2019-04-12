import { fromEvent, merge, Observable } from 'rxjs';
import { map, scan, debounceTime, switchMap, throttleTime } from 'rxjs/operators';
import Moment from 'moment';
import CookieReader from './cookieReader';

export default class ArticleEditor {
    /**
     *
     * @param {Object} cache
     * @param {Object} Materialize
     * @param {Object} ckEditor
     * @param {Object} dateTimePicker
     * @param {string} fromURL
     */
    constructor(cache, Materialize, ckEditor, dateTimePicker, isUpdate, updateId, fromURL = 'posts') {
        // first, cache the ui elemets to be used later
        let c = cache;
        this.cache = {
            editorContainer: c.editor,
            sidenavTrigger: c.sidenavTrigger,
            HTMLTrigger: c.htmlTab,
            HTMLContainer: c.htmlContainer,
            closeBtn: c.closeEdit,
            previewBtn: c.previewEdit,
            publishBtn: c.publishEdit,
            postTitle: c.postTitle,
            wordCount: c.wordCount,
            lastSave: c.lastSave,
            editStatus: c.editStatus,
            settings: {
                accordion: c.accordion,
                deleteBtn: c.deleteEdit,
                genericModalYes: c.genericModalYes,
                genericModalNo: c.genericModalNo,
                genericModalTemplate: c.genericModalTemplate,
                genericModal: c.genericModal,
                datePicker: c.datePicker,
                dateContainer: c.dateContainer,
                datePickerContainer: c.datepickerDropDown,
                stickFront: c.stickFront,
                pendingReview: c.pendingReview,

                category: c.category,
                tags: c.tags,
                featuredImg: c.featuredImg,
                featuredImgUploader: c.featuredImgUploader,
                featuredImgUploaderBtn: c.featuredImgUploaderBtn,

                shareOn: c.shareOn,
                excerpt: c.postExcerp
            }
        };
        // Save status flag
        this._status = '';
        // isPostUpdate
        this._isPostUpdate = isUpdate;
        this._updateId = updateId;
        // On close URL
        let origin = window.location.origin;
        this.onCloseURL = new URL(`admin/${fromURL}`, origin);
        // check if jquery was loaded and assign it to a class property
        if (!window.jQuery) {
            console.error('JQuery global instance was not found. \n Load jQuery gloablly before initializing ArticleEditor');
        } else {
            this.jQuery = window.jQuery;
        }
        // check if materialize was given and assign it to a class property
        if (typeof Materialize !== "object") {
            console.error(typeof Materialize + '\nMaterializeJs was not provided');

        } else {
            this.M = Materialize;
        }
        // check if ckEditor was given and assign it to a class property
        if (typeof ckEditor !== "function") {
            console.error(typeof ckEditor + '\nCkEditor was not provided');

        } else {
            this.editor = ckEditor;
        }
        // check if dateTimePicker was given and assign it to a class property
        if (typeof dateTimePicker !== "function") {
            console.error(typeof dateTimePicker + '\nDateTimePicker was not provided');

        } else {
            this.picker = dateTimePicker;
        }
    }

    // initialize the editor container and materialize
    init() {
        let $ = this.jQuery;
        let d = this.editor;
        let c = this.cache;
        let cs = c.settings;
        let M = this.M;
        let _this = this;
        let picker;
        _this.saver = _this.saveEdit();
        _this.postSettings = _this.getPostSettings();

        // editor
        d.create($(c.editorContainer)[0], {
                autosave: {
                    save(editor) {
                        _this.setPostData(editor.getData());
                    }
                },
                ckfinder: {
                    uploadUrl: '/admin/media/upload',
                }
            })
            .then(editor => {
                _this.editor = editor;
                editor.model.document.on('change:data', () => { _this.cache.lastSave.trigger('resetTimer') });
                //initialize tooltipps
                $('.tooltipped').tooltip();
            })
            .catch(err => {
                console.error(err.stack);
            });

        /**materialize
         * sidenav, picker dropdown,chips,textarea character counter
         * use M when an instance is neede i.e: for picker dropdown
         **/
        $(c.sidenavTrigger).sidenav({ edge: 'right' });
        cs.accordion.collapsible({
            onOpenStart: (e) => {
                let i = $(e)[0].children[0].children[0];
                i.classList.remove('mdi-chevron-down');
                i.classList.add('mdi-chevron-up');
            },
            onCloseStart: (e) => {
                let i = $(e)[0].children[0].children[0];
                i.classList.remove('mdi-chevron-up');
                i.classList.add('mdi-chevron-down');
            },
        });
        M.Dropdown.init(cs.datePicker, {
            closeOnClick: false,
            constrainWidth: false,
            alignment: 'right',
            onCloseStart: () => {
                if (_this._picker.isOpen) {
                    _this._picker.close();
                }
            }
        });
        let itag = M.Chips.init(cs.tags, {
            placeholder: 'Tag here',
            secondaryPlaceholder: '+Tag',
            minLength: 1,
            limit: 5,
            onChipAdd: () => {
                let _d = [];
                itag[0].chipsData.forEach(t => {
                    _d.push(t.tag)
                });
                cs.tags.trigger($.Event('value', { d: _d }))
            },
            onChipDelete: () => {
                let _d = [];
                itag[0].chipsData.forEach(t => {
                    _d.push(t.tag)
                });
                cs.tags.trigger($.Event('value', { d: _d }))
            }
        });
        $(cs.excerpt).characterCounter();

        // Initialize all othe Materializejs auto-initiliazed components
        M.AutoInit();

        // Initialize date picker and pas its instance to bindui
        _this._picker = _this.initPicker(cs.datePickerContainer, cs.dateContainer, _this.picker, _this.jQuery);

        //Call bindUI
        // Create an event objects
        let events = [{
            key: 'close',
            value: _this.closeEditor
        }, {
            key: 'preview',
            value: _this.previewEdit
        }, {
            key: 'publish',
            value: _this.publishPost
        }, {
            key: 'delete',
            value: _this.deleteDraft
        }, {
            key: 'setHTML',
            value: _this.setHTMLTabData
        }, {
            key: 'showPicker',
            value: _this.showPicker
        }, {
            key: 'dateChange',
            value: _this.updateUI().date
        }]

        _this.bindUI(c, events, _this._picker);
        // Get and set initial data(old data) if its an update
        if (_this._isPostUpdate) {
            _this._UpdatePost.call(_this)
        }
    }

    /**
     * Intitialize a datepicker and attach event triggers for submit/change and picker close events.
     */
    initPicker(containerBtn, pickerDropdown, M, $) {
        let _c = containerBtn;
        let _M = M;

        const picker = new _M()
            .on('close', () => {
                //Trigger a close event on the picker dropdown
                _c.trigger('close');
            });
        return picker;
    }

    /**
     * On dropdown click initialize the picker and listern for close evnts.
     */
    showPicker(btn, dropdown, scheduleCont, p) {
        let _this = this;
        _this._picker.on('submit', (e) => {
            _this.updateUI().date(btn, scheduleCont, p.value);
        });
        _this._picker.open();
        dropdown.on('close', e => {
            let instance = this.M.Dropdown.getInstance($('.datepickerdropdown-trigger'));
            instance.close();

        });
    }

    /**
     * Closes the editor page/window and navigates to the previous page.
     * First check the edit status to see if it is saved, if it is edited it first save then proceeds.
     */
    closeEditor() {
        let _this = this;
        if (_this._status !== 'saved') {
            _this.saver.editorData();
        }
        window.location.assign(_this.onCloseURL);
    }

    /**
     * Deletes the editor content.
     * For a published post fire a toast/dialog modal "Posts can be deleted in posts section."
     * For a new edit or a pending review a fire-up a modal dialogue for Yes/No then clear the editor
     * and delete the uploaded or saved(in cache) ressources i.e: images.
     */
    deleteDraft() {
        let _this = this;
        let c = _this.cache.settings;
        let isPublished = CookieReader.getItem('isPublished') || false;
        if (isPublished) {
            // _this.M.toast({ html: 'Published posts can be deleted in posts section' })
            // Delete or archive the post
        } else {
            let id = CookieReader.getItem('editingPostID');
            let ins = M.Modal.init(c.genericModal, { opacity: 0, dismissible: false, endingTop: '60%' });
            ins[0].open();
            c.genericModalYes.on('click', () => {
                let jq = _this.jQuery.ajax(`http://localhost:3000/admin/posts/delete?id=${id}`, {
                    method: 'DELETE',
                    dataType: 'json',
                });
                jq.then(r => {
                    console.log(r);
                    if (r.deleted === true) {
                        window.location.assign(_this.onCloseURL);
                    }
                });
                ins[0].close();
            });
            c.genericModalNo.on('click', () => {
                ins[0].close();
            });
        }
    }

    /**
     * Opens up a preview window, with the editor saved content.
     * Check status if not saved do it then open up a new tab with article url.
     */
    previewEdit() {
        let _this = this;
        if (_this._status !== 'saved') {
            _this.saver.editorData();
        }
        let id = CookieReader.getItem('editingPostID');
        let title = (_this.saver.DATA().title.toLowerCase()).replace(/(\s)/g, (w) => '-');
        // Post URL format avpaul.me/article/here-goes-the-title?id=201811052301
        let postUrl = new URL(`${title}?id=${id}`, 'http://localhost:3000/admin/posts/preview/');
        window.open(postUrl.href);
    }

    /**
     * Publish a new post.
     * Fire-up a modal for publish comfirmation. Check all post settings
     * and if conditions for publish are met then post it.
     * conditions:
     *  1.Publish date must be set to immediately
     *    i.e: when other than immediately its can cause other issues as it is an automated process.
     *  2.Title
     *  3.>= 500  words
     *  4.1 Category & Tag/s
     *  5.Featured image
     *  6.excerpt(with valid character count)
     */
    publishPost() {
        let _this = this;
        let c = _this.cache.settings;
        let isPublished = CookieReader.getItem('isPublished') || false;
        if (isPublished) {
            // The post is already published dont care about this
        } else {
            let id = CookieReader.getItem('editingPostID');
            c.genericModalTemplate.text('Do you want to publish this post?');
            let ins = M.Modal.init(c.genericModal, { opacity: 0, dismissible: false, endingTop: '60%' });
            c.genericModalYes.on('click', () => {
                console.log('cl');
                // let pd = _this.saver.DATA();
                // check if conditions are met
                let jq = _this.jQuery.ajax(`http://localhost:3000/admin/posts/publish/?id=${id}&status=publish`, {
                    method: 'POST',
                    dataType: 'json',
                });
                jq.then(r => {
                    if (r.published === true) {
                        let title = (_this.saver.DATA().title.toLowerCase()).replace(/(\s)/g, (w) => '-');
                        // Post URL format avpaul.me/article/here-goes-the-title?id=201811052301
                        let postUrl = new URL(`${title}?id=${r.id}`, 'http://localhost:3000/blog/');
                        console.log(postUrl);
                        window.open(postUrl.href);
                        // window.location.assign(postUrl.href);
                    }
                });
                ins[0].close();
            });
            ins[0].open();
            c.genericModalNo.on('click', () => {
                ins[0].close();
            });
        }
    }

    /**
     * When the editor tab changes to HTML View get the editor content.
     */
    setHTMLTabData(container) {
        let data = this.editor.getData();

        function format(t) {
            let check = /(<\/\w+>)|(><\w{1,}>)/g;
            let text = t.replace(check, (s) => {
                if (s.match(/^>/)) {
                    return s.replace(/^>/, _s => {
                        return `${_s}\n`
                    });
                }
                return `${s}\n`;
            });
            container.text(text);
        }
        (data === '<p>&nbsp;</p>') ? container.text('<p>Nothing to show now!</p>'): format(data);

    }

    /**
     * Wrapper for the Filereader.
     */
    readResource(url) {
        // Send it to the server and return an url to it
        let res = Observable.create((obs) => {
            var data = new FormData();
            data.set("upload", url);
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    let r = JSON.parse(this.response);
                    obs.next(r.url);
                }
            });
            xhr.open("POST", "http://localhost:3000/admin/media/upload");
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.send(data);
        })
        return res;
    }

    /**
     * Returns an Observable value which evaluates to the editor wordcount.
     */
    getWordCount() {}

    /**
     * Passed to ckeditor auto-save plugin.
     * @param {string} data
     */
    setPostData(data) {
        // Use an observable to throttle.
        let _d = Observable.create(obs => {
            obs.next(data);
        }).pipe(
            throttleTime(1000),
        );

        // Subscribe to the observable and return a promise when data has bess saved.
        _d.subscribe(d => {
            this.saver.editorData(d);
        });
        return new Promise((resolve, reject) => {
            resolve()
        });
    }

    /**
     * Returns an object of the post settings
     * i.e:{
     *    title
     *    stickFront
     *    pendingReview
     *    category
     *    tags
     *    share
     *    excerpt
     *    publishDate
     *    featuredImage
     * }
     */
    getPostSettings() {
        let _this = this;

        let _M = _this.M;
        let _cs = _this.cache.settings
        let _s = {
            title: _this.cache.postTitle,
            front: _cs.stickFront,
            review: _cs.pendingReview,
            categories: _cs.category,
            tags: _cs.tags,
            shareOn: _cs.shareOn,
            excerpt: _cs.excerpt,
            featuredImageUploader: _cs.featuredImgUploader,
            featuredImg: _cs.featuredImg
        };

        // Create Observables for each setting the combine/merge them together.

        function _title() {
            return fromEvent(_s.title, 'input').pipe(
                map((e) => {
                    return { 'title': e.target.innerText }
                }),
                debounceTime(1000)
            )
        }

        function _stickFront() {
            return fromEvent(_s.front, 'change').pipe(
                map((e) => {
                    return { 'stickOnFront': e.target.checked }
                })
            )
        }

        function _pendingReview() {
            return fromEvent(_s.review, 'change').pipe(
                map((e) => {
                    return { 'pendingReview': e.target.checked }
                })
            )
        }

        function _category() {
            return fromEvent(_s.categories, 'change').pipe(
                map(e => {
                    return { 'category': [e.target.name] }
                }),
                scan((acc, cur) => {
                    let key = cur.category[0];
                    if (acc.category.includes(key)) {
                        let res = { category: [] };
                        res.category = acc.category.filter((_c) => _c !== key)
                        return res;
                    } else {
                        acc.category.push(key);
                        return acc;
                    }

                })
            )
        }

        function _tags() {
            return fromEvent(_s.tags, 'value').pipe(
                map((v) => {
                    return { 'tags': v.d };
                })
            )
        }

        function _shareOn() {
            return fromEvent(_s.shareOn, 'change').pipe(
                map(e => {
                    return { 'shareOn': [e.target.name] };
                }),
                scan((acc, cur) => {
                    let key = cur.shareOn[0];
                    if (acc.shareOn.includes(key)) {
                        let res = { shareOn: [] };
                        res.shareOn = acc.shareOn.filter((_c) => _c !== key)
                        return res;
                    } else {
                        acc.shareOn.push(key);
                        return acc;
                    }

                })
            )
        }

        function _excerpt() {
            return fromEvent(_s.excerpt, 'input').pipe(
                map(e => {
                    return { 'excerpt': e.target.value };
                }),
                debounceTime(1000)
            )
        }

        function _publishDate(picker) {
            return fromEvent(picker, 'submit').pipe(
                map((e) => {
                    // Emit  value{mm,HH,DD,MM,YYYY}
                    let minutes = e.format('mm');
                    let hour = e.format('HH');
                    let day = e.format('DD');
                    let month = e.format('MM');
                    let year = e.format('YYYY');

                    let serverValue = {
                        minute: minutes,
                        hour: hour,
                        day: day,
                        month: month,
                        year: year
                    }
                    return { 'publicationDate': serverValue };
                })
            )
        }

        function _featuredImage() {
            return fromEvent(_s.featuredImageUploader, 'change').pipe(
                switchMap(function(e) {
                    let _o;
                    let file = e.target.files[0];
                    _o = _this.readResource(file);
                    return _o.pipe(map(val => {
                        _s.featuredImg.trigger(_this.jQuery.Event('change:file', { file: val }))
                        console.log(val);
                        return { 'featuredImage': val }
                    }));

                })
            )
        }


        function _all(dp) {
            let subject = merge(
                _title(),
                _stickFront(),
                _pendingReview(),
                _tags(),
                _category(),
                _excerpt(),
                _shareOn(),
                _featuredImage(),
                _publishDate(dp)
            );
            return subject;
        }
        return {
            all: _all,
        }
    }

    /**
     * Save the post edit on the server or in localstorage when offline.
     * Saved content are: post title,editor content and post settings.
     * First time all are saved, for next time only changed contents are saved.
     */
    saveEdit() {

        let _this = this;
        let $ = _this.jQuery;
        let status = 'editing';
        let isFirst = !_this._isPostUpdate;
        let updateId = _this._updateId;
        let url = `/admin/posts/new?status=${status}`;
        let updateurl = `/admin/posts/update?status=${status}&id=${updateId}`;
        let settings = {};
        let editorContent = '';
        let errorTemplates = {
            title: `<div class="mdi mdi-alert-outline">Cant\'t be saved without a <span>title</span></div>`,
            category: `<div class="mdi mdi-alert-outline">Cant\'t be saved without a <span>category</span></div>`
        }

        function _setData(d, s) {
            editorContent = d;
            settings = s
        }

        function _getData() {
            return settings
        }

        function _saveSettings(datePicker) {
            let _o = _this.postSettings.all(datePicker);
            _o.subscribe(
                (value) => {
                    Object.assign(settings, value);
                    _this.cache.lastSave.trigger('resetTimer');
                    _this._status = 'edited';
                    _saveEditorData(editorContent)
                }
            )
        }

        function _saveEditorData(editorData = editorContent) {
            editorContent = editorData;
            let _d = {
                editorData: editorData,
                postSettings: JSON.stringify(settings)
            };
            let noTitle = !settings.title || settings.title === '';
            let noCategory = !settings.category || settings.category === '' || settings.category.legth === 0;

            // MUST BE SET BEFORE ANY SAVE: Title and category
            if (noTitle) {
                _this.M.toast({ html: errorTemplates.title });
            }
            if (noCategory) {
                _this.M.toast({ html: errorTemplates.category });

            }
            if (noTitle || noCategory) {
                return
            } else {
                // Send an Ajax post
                let _s;
                (isFirst) ? _s = $.posts(url, _d): _s = $.posts(updateurl, _d);

                _s.then(r => {
                    console.log(r);
                    if ((r.saved && r.saved === true) || (r.updated && r.updated === true)) {
                        _this.cache.lastSave.trigger('updateTimer');
                        _this._status = 'saved';
                        isFirst = false;
                        updateId = r.id;
                    }
                }).catch(err => {
                    if (err.message) {
                        let errorTemplate = `<div>Post was not saved</div><div>${err.message}</div>`
                        _this.M.toast({ html: errorTemplate });
                    }
                });
            }
        }

        return {
            DATA: _getData,
            setData: _setData,
            settings: _saveSettings,
            editorData: _saveEditorData
        }
    }

    /**
     * Update edit status, word count, publish date and last save timer.
     */
    updateUI() {
        function _count(e, counter) {
            counter.subscribe(value => {
                e.html(`${value} words.`);
            });
        }

        function _date(container, scheduleCont, value) {
            let dayOfWeek, dayCardinal, monthLong, hour, minutes = '';

            if (!value._isAMomentObject) {
                value = Moment(value)
            }
            dayOfWeek = value.format('ddd');
            dayCardinal = value.format('Do');
            monthLong = value.format('MMM');
            minutes = value.format('mm');
            hour = value.format('HH');

            let date = `${dayOfWeek} ${dayCardinal} ${monthLong} @ ${hour}:${minutes}`;
            const ICON_ELT = container.children();
            container.html('');
            container.html(ICON_ELT);
            scheduleCont.text(date).parent().removeClass('d-none');
        }

        function _featuredImg(imgCont, btn, path) {
            imgCont.attr('src', path).removeClass('no-image').addClass('z-depth-3');
            btn.addClass('animated slideindown').removeClass('no-image').text('change image');
        }
        return {
            count: _count,
            date: _date,
            featuredImg: _featuredImg
        };
    }

    /**
     * Bind the cached ui elements to functions using them.
     *  @param {object} cache
     *  @param {[]}  events
     */
    bindUI(cache, events, picker) {
        let _this = this;
        let c = cache;
        let cs = c.settings;

        //Get event handler
        function getHandler(key) {
            let fn;
            events.forEach(event => {
                if (event.key === key && Reflect.has(event, 'value')) {
                    fn = event.value;
                }
            });
            return fn;
        }

        c.closeBtn.on('click', getHandler('close').bind(_this));
        c.HTMLTrigger.on('click', getHandler('setHTML').bind(_this, c.HTMLContainer));
        cs.datePicker.on('click', getHandler('showPicker').bind(_this, cs.datePicker, cs.datePickerContainer, cs.dateContainer, picker));
        cs.deleteBtn.on('click', getHandler('delete').bind(_this));
        c.previewBtn.on('click', getHandler('preview').bind(_this));
        c.publishBtn.on('click', getHandler('publish').bind(_this));
        cs.featuredImgUploaderBtn.on('click', () => { cs.featuredImgUploader.click() });
        cs.featuredImg.on('change:file', (e) => {
            if (typeof e.file === 'string') {
                _this.updateUI().featuredImg(cs.featuredImg, cs.featuredImgUploaderBtn, e.file)
            }
        });
        c.lastSave.on('updateTimer', () => { c.lastSave.text('saved').removeClass('edited') });
        c.lastSave.on('resetTimer', () => { c.lastSave.text('edited').addClass('edited') });
        _this.saver.settings.call(_this, picker);
    }

    _UpdatePost() {
        let _this = this;
        let $ = _this.jQuery;
        let id = _this._updateId;
        // Get the current data from the server
        let d = $.ajax('http://localhost:3000/admin/posts/update/oldversion', {
            method: 'GET',
            dataType: 'json',
            data: { id: id },
        });
        d.then(p => {
            // Separate editor content and post settings
            let d = p.content;
            Reflect.deleteProperty(p, 'content');
            // Change the publicationDate to an object {day: "29",hour: "21",minute: "50",month: "09",year: "2018"}
            let pd = Moment(p.publicationDate);
            let _pd = { minute: pd.format('mm'), hour: pd.format('HH'), day: pd.format('DD'), month: pd.format('MM'), year: pd.format('YYYY') }
                // Update time
            _this.updateUI().date(_this.cache.settings.datePicker, _this.cache.settings.dateContainer, pd);
            p.publicationDate = _pd;
            // Update the saver and the editor
            _this.saver.setData(d, p)
            if (d !== '') {
                _this.editor.setData(d)
            }
            // Update tags
            let t = p.tags;
            if (Array.isArray(t) && t.length > 0) {
                let itag = _this.M.Chips.getInstance(_this.cache.settings.tags[0]);
                t.forEach(_t => {
                    itag.addChip({ tag: _t })
                });
            }
            // Resize the textarea
            // _this.M.textareaAutoResize(_this.cache.settings.excerpt)
            // Initialize check boxes
            // Categories
            let c = p.category
            if (Array.isArray(c) && c.length > 0) {
                let csc = _this.cache.settings.category;
                let _csc = [csc[0], csc[1], csc[2]];
                c.forEach(_c => {
                    _csc.forEach(e => {
                        if (e.name === _c) {
                            e.dispatchEvent(new Event('change'))
                        }
                    });
                });
            }
            // ShareOn
            let s = p.shareOn
            if (Array.isArray(s) && s.length > 0) {
                let csc = _this.cache.settings.shareOn;
                let _csc = [csc[0], csc[1], csc[2]];
                s.forEach(_c => {
                    _csc.forEach(e => {
                        if (e.name === _c) {
                            e.dispatchEvent(new Event('change'))
                        }
                    });
                });
            }
        }).catch(err => {
            _this.M.toast({ html: err.message })
        })
    }
}
