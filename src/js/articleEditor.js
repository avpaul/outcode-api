import { fromEvent, merge, Observable } from 'rxjs';
import { map, startWith, scan, debounceTime, switchMap } from 'rxjs/operators';
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave';

export default class ArticleEditor {
    /**
     * 
     * @param {Object} cache 
     * @param {Object} Materialize 
     * @param {Object} ckEditor 
     * @param {Object} dateTimePicker 
     * @param {string} fromURL 
     */
    constructor(cache, Materialize, ckEditor, dateTimePicker, fromURL = 'posts') {
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
                postTiltle: c.postTitle,
                wordCount: c.wordCount,
                lastSave: c.lastSave,
                editStatus: c.editStatus,
                settings: {
                    deleteBtn: c.deleteEdit,
                    datePicker: c.datePicker,
                    dateContainer: c.dateContainer,
                    datePickerContainer: c.datepickerDropDown,
                    stickFront: c.stickFront,
                    pendingReview: c.pendingReview,
                    // category: [
                    //     c.category_bsns,
                    //     c.category_tech,
                    //     c.category_others
                    // ],
                    category: c.category,
                    tags: c.tags,
                    featuredImg: c.featuredImg,
                    featuredImgUploader: c.featuredImgUploader,
                    featuredImgUploaderBtn: c.featuredImgUploaderBtn,
                    // shareOn: [
                    //     c.shareOn_facebook,
                    //     c.shareOn_twitter,
                    //     c.shareOn_insta
                    // ],
                    shareOn: c.shareOn,
                    excerpt: c.postExcerp
                }
            }
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

        // editor
        d.create($(c.editorContainer)[0])
            .then(editor => {
                _this.editor = editor;
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
        let pickerInstance = M.Dropdown.init(cs.datePicker, {
            closeOnClick: false,
            constrainWidth: false,
            alignment: 'right'
        });
        $(cs.tags).chips({
            placeholder: 'Tag here',
            secondaryPlaceholder: '+Tag',
            minLength: 1,
            limit: 5
        });
        $(cs.excerpt).characterCounter();

        // Initialize all othe Materializejs auto-initiliazed components
        M.AutoInit();

        // Initialize date picker and pas its instance to bindui
        picker = _this.initPicker(cs.datePickerContainer, cs.dateContainer, _this.picker, _this.jQuery);

        //Initialize DOMObserver for tags.
        _this.DOMObserver(cs.tags[0], { childList: true });

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

        _this.bindUI(c, events, picker);
    }

    /**
     * Intitialize a datepicker and attach event triggers for submit/change and picker close events.
     */
    initPicker(containerBtn, pickerDropdown, M, $) {
        let _c = containerBtn;
        let _p = pickerDropdown;
        let _M = M;
        let _$ = $;
        const picker = new _M()
            .on('submit', (value) => {



            })
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
        p.open();
        dropdown.on('close', e => {
            let instance = this.M.Dropdown.getInstance($('.datepickerdropdown-trigger'));
            instance.close();
            _this.updateUI().date(btn, scheduleCont, p.value);
        });
    }

    /**
     * Closes the editor page/window and navigates to the previous page.
     * First check the edit status to see if it is saved, if it is edited it first save then proceeds.
     */
    closeEditor() {
        let _this = this;
        let status = _this.getPostSettings();
        if (status !== 'saved') {
            _this.saveEdit();
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

    }

    /**
     * Opens up a preview window, with the editor saved content.
     * Check status if not saved do it then open up a new tab with article url.
     * Works online or on localhost only. 
     */
    previewEdit() {

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

    }

    /**
     * Returns edited(true) & and a timestamp for last save when the editor content is newer than the saved content.
     * On edit save the status is saved, on edit a changed event is fired to update the status.
     * Return an observable value which evaluates to saved/edited and a timestamp for last save.
     */
    getEditStatus() {
        return 'saved';
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
     * A utility function for watching DOM content change.
     */
    DOMObserver(node, config) {
        let _target = node;
        let _o;
        let _fn = function(list) {
            for (let _e of list) {
                if (_e.type === 'childList') {
                    let event = new Event('change');
                    _target.dispatchEvent(event);
                }
            }
        }
        _o = new MutationObserver(_fn);
        _o.observe(_target, config);
    }

    /**
     * Wrapper for the Filereader.
     */
    readResource(url) {
        let result = Observable.create(sub => {
            let reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === reader.DONE) {
                    sub.next(reader.result);
                } else {
                    sub.error(reader.error);
                }
            }
            reader.readAsDataURL(url);
        });
        return result;
    }

    /**
     * Uploads a ressource to the server and returns the uploaded ressource.
     * @param {string} file
     * @param {string} url 
     */
    upload(data, url) {
        let $ = this.jQuery;
        return new Promise((resolve, reject) => {
            if (typeof url === undefined || url === '') {
                reject('URL is not set or is an empty string');
            } else if (data === {}) {
                reject('Data object is empty');
            }
            $.post(url, data, (response) => resolve(response));
        })

    }

    /**
     * Returns an Observable value which evaluates to the editor wordcount. 
     */
    getWordCount() {}

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
    getPostSettings(postTitle, settingsUI, fileReader, M, picker) {
        let _M = M;
        let _s = {
            title: postTitle,
            front: settingsUI.stickFront,
            review: settingsUI.pendingReview,
            categories: settingsUI.category,
            tags: settingsUI.tags,
            shareOn: settingsUI.shareOn,
            excerpt: settingsUI.excerpt,
            featuredImageUploader: settingsUI.featuredImgUploader
        };

        // Create Observables for each setting the combine/merge them together.

        let title,
            stickFront,
            pendingReview,
            tags,
            category,
            excerpt,
            featuredImage,
            shareOn,
            publishDate,
            subject;

        title = fromEvent(_s.title, 'input').pipe(
            map((e) => {
                return { 'title': e.target.innerText }
            }),
            debounceTime(1000),
            startWith({ 'title': undefined })
        );

        stickFront = fromEvent(_s.front, 'change').pipe(
            map((e) => {
                return { 'stickFront': e.target.checked }
            }),
            startWith({ 'stickFront': false })
        );

        pendingReview = fromEvent(_s.review, 'change').pipe(
            map((e) => {
                return { 'pendingReview': e.target.checked }
            }),
            startWith({ 'pendingReview': false })
        );

        category = fromEvent(_s.categories, 'change').pipe(
            map(e => {
                return { category: [e.target.name] }
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

            }),
            startWith({ 'category': undefined })
        );

        tags = fromEvent(_s.tags, 'change').pipe(
            map(() => {
                let _tags = [];
                let data = M.Chips.getInstance(_s.tags).chipsData;
                data.forEach(d => {
                    _tags.push(d.tag);
                });
                return { 'tags': _tags };
            }),
            startWith({ 'tags': undefined })
        );

        shareOn = fromEvent(_s.shareOn, 'change').pipe(
            map(e => {
                return { shareOn: [e.target.name] };
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

            }),

            startWith({ shareOn: undefined })
        );

        excerpt = fromEvent(_s.excerpt, 'input').pipe(
            map(e => {
                return { 'excerpt': e.target.value };
            }),
            debounceTime(1000),
            startWith({ 'excerpt': undefined })
        );

        publishDate = fromEvent(picker, 'submit').pipe(
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
                return { 'publishDate': serverValue };
            }),
            startWith({ 'publishDate': 'immediately' })
        );

        featuredImage = fromEvent(_s.featuredImageUploader, 'change').pipe(
            switchMap(function(e) {
                let _o;
                let file = e.target.files[0];
                _o = fileReader(file);
                return _o.pipe(map(val => { return { 'featuredImage': val } }));
            }),
            startWith({ 'featuredImage': undefined })
        );

        subject = merge(
            title,
            stickFront,
            pendingReview,
            tags,
            category,
            excerpt,
            shareOn,
            featuredImage,
            publishDate
        );
        return subject;
    }

    /**
     * Save the post edit on the server or in localstorage when offline.
     * Saved content are: post title,editor content and post settings.
     * First time all are saved, for next time only changed contents are saved. 
     */
    saveEdit(datePicker) {
        let config = [
            this.cache.postTiltle,
            this.cache.settings,
            this.readResource,
            this.M,
            datePicker
        ];
        let settings = this.getPostSettings(...config);
        settings.subscribe(
            (value) => {
                console.log(value);
            }
        );
        // let $ = this.jQuery;
        // let url;
        // let timestamp;
        // if (!window.navigator.onLine) {
        //     // The user is offline, use localStorage
        //     if (window.localStorage) {
        //         localStorage.newPost = data;
        //         return { newData: data, lastSave: timestamp }
        //     }
        // } else {
        //     // Send an Ajax post
        //     $.post(url, data);
        // }
    }

    /**
     * Update edit status, word count, publish date and last save timer.
     */
    updateUI() {

        function _status(elt, state) {
            state.subscribe(value => {
                elt.html(value)
            })
        }

        function _count(elt, counter) {
            counter.subscribe(value => {
                elt.html(`${value} words.`);
            });
        }

        function _timer(elt, timestamp, clock) {
            clock.subscribe(value => {
                let _lastSave = (Date.now() - (timestamp + value));
                elt.html(`Saved ${_lastSave}s ago.`);
            });
        }

        function _date(container, scheduleCont, value) {

            let dayOfWeek = value.format('ddd');
            let dayCardinal = value.format('Do');
            let monthLong = value.format('MMM');
            let minutes = value.format('mm');
            let hour = value.format('HH');

            let date = `${dayOfWeek} ${dayCardinal} ${monthLong} @ ${hour}:${minutes}`;
            const ICON_ELT = container.children();
            container.html('');
            container.html(ICON_ELT);
            scheduleCont.text(date).parent().removeClass('d-none');
        }
        return {
            status: _status,
            count: _count,
            timer: _timer,
            date: _date
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
        c.previewBtn.on('preview', getHandler('preview').bind(_this));
        c.publishBtn.on('click', getHandler('publish').bind(_this));
        cs.dateContainer.on('dateChange'), getHandler('dateChange').bind(null, cs.datePicker, cs.dateContainer);
        cs.featuredImgUploaderBtn.on('click', () => { cs.featuredImgUploader.click() });
        _this.saveEdit(picker);
    }
}