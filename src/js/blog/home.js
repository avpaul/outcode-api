import M from '../../vendorjs/materialize.min';

function _mobileNavTrigger() {

    let o = false;
    let i = M.Sidenav.init($('.sidenav#mobile-nav'), {
        edge: 'left',
        onOpenStart: () => {
            $('.menubar_t').addClass('open');
            $('.menubar_b').addClass('open');
            $('.menubar_m').addClass('open');
            o = true;
        },
        onCloseEnd: () => {
            $('.menubar_t').removeClass('open');
            $('.menubar_b').removeClass('open');
            $('.menubar_m').removeClass('open');
            o = false;
        }
    });
    $('nav .menubar').on('click', () => {
        if (!o) {
            $('.menubar_t').addClass('open');
            $('.menubar_b').addClass('open');
            $('.menubar_m').addClass('open');
            i[0].open();
            o = true;
        } else {
            i[0].close();
            o = false;
        }
    });
}
$(document).ready(() => {
    _mobileNavTrigger();
})



if (module.hot) {
    module.hot.accept();
    module.hot.accept('./home.js', () => {
        window.location.reload()
    });

    module.hot.accept('../newpost.js', () => {
        window.location.reload()
    });
}