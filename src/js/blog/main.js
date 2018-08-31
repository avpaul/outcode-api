var open = false;
document.getElementById('navbar-toggler').addEventListener('click', () => {
    if (!open) {
        document.querySelector('div.navbar-togller-b1').style.backgroundColor = '#ff2f2f';
        document.querySelector('div.navbar-togller-b2').style.backgroundColor = '#ff2f2f';
        document.querySelector('div.navbar-togller-b3').style.backgroundColor = '#ff2f2f';
    } else {
        document.querySelector('div.navbar-togller-b1').style.backgroundColor = '#fff';

        document.querySelector('div.navbar-togller-b2').style.backgroundColor = '#fff';

        document.querySelector('div.navbar-togller-b3').style.backgroundColor = '#fff';

    }
    document.querySelector('div.navbar-togller-b1').classList.toggle('fold-down');
    document.querySelector('div.navbar-togller-b2').classList.toggle('fade-rot');
    document.querySelector('div.navbar-togller-b3').classList.toggle('fold-up');
    open = !open;
})