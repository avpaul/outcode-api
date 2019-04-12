import M from '../../vendorjs/materialize.min';
import CookieReader from '../cookieReader';
class UserLogger {

    constructor() {
        this._init.call(this);
    }

    _cacheUI() {
        let cache = {};
        cache = {
            userEmail: $('#user-email'),
            userPassword: $('#user-password'),
            userSignInBtn: $('#signIn'),
            userSignUpBtn: $('#signUp'),
        }
        return cache;
    }

    _createEvents() {
        let _events = [];
        _events = [{
                key: '_login',
                value: function _login(e, p) {
                    // Receives user data: userEmail and userPassword

                    if (!e || e === '' || !p || p === '') return;
                    let _e = e;
                    let _p = p;
                    let url = 'http://localhost:3000/admin/login';
                    let nextUrl = 'http://localhost:3000/admin/metrics';
                    let ajxRes;

                    ajxRes = $.ajax(url, {
                        dataType: 'json',
                        method: 'POST',
                        data: {
                            email: _e,
                            password: _p
                        }
                    });
                    ajxRes.then((r) => {
                        console.log(r);
                        // let t = r.token;
                        // let _t = window.atob(t).split('.');
                        // if (localStorage.getItem('token')) {
                        //     localStorage.removeItem('token')
                        // }
                        // localStorage.setItem('token', {
                        //     token: _t[0],
                        //     expires: _t[1],
                        //     hash: _t[2]
                        // });
                        // CookieReader.setItem('authorization', r.headers.authorization);
                        window.location.assign(`${nextUrl}`);
                    }).catch((err) => {
                        console.log(err);
                        M.toast({ html: err.message });
                    })
                }
            },
            {
                key: '_signup',
                value: function _signup(e, p) {
                    if (!e || e === '' || !p || p === '') return;
                    let _e = e;
                    let _p = p;
                    let url = 'http://localhost:3000/admin/signup';
                    let nextUrl = 'http://localhost:3000/admin/login';
                    let ajxRes;

                    ajxRes = $.ajax.posts(
                        url, {
                            email: _e,
                            password: _p
                        },
                        null,
                        'json',
                    );
                    ajxRes.then((r) => {
                        if (r.statusCode === 200) {
                            window.location.assign(`${nextUrl}`);
                        }
                    }).catch((err) => {
                        M.toast({ html: 'Please try again!' });
                    })
                }
            }

        ];
        return _events;
    }

    _bindUI() {
        let _this = this;
        let c = _this._cache;
        c.userSignInBtn.on('click', () => {
            let e = c.userEmail.val() || '';
            let p = c.userPassword.val() || '';
            if (e === '') {
                M.toast({ html: 'Email not set' });
            } else if (p === '') {
                M.toast({ html: 'Password not set' });
            } else {
                _this._login.call(_this, e, p);
            }
        });
        c.userSignUpBtn.on('click', () => {
            let _this = this;
            let c = _this._cache;
            let e = c.userEmail.val() || '';
            let p = c.userPassword.val() || '';
            if (e === '') {
                M.toast({ html: 'Email not set' });
            } else if (p === '') {
                M.toast({ html: 'Password not set' });
            } else {
                _this._signup.call(_this, e, p);
            }
        });
    }

    _init() {
        let _this = this;
        let _cache = _this._cacheUI();
        let _events = _this._createEvents();

        // Add properties to this
        // _this._cache = _cache;
        Object.defineProperty(_this, '_cache', { value: _cache });
        _events.forEach(evt => {
            Object.defineProperty(_this, evt.key, { value: evt.value })
        });
        _this._bindUI.call(_this);
    }

}

new UserLogger();

if (module.hot) {
    module.hot.accept();
}
