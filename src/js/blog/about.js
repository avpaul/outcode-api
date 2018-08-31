// on load make sure that the visitor name is always empty
window.onload = function() {
        document.getElementById('visitor-name').value = '';
    }
    // listen for the input event to update the user name
document.getElementById('visitor-name').addEventListener('input', (e) => {
    var nameSpans = document.querySelectorAll('span.visitor-name');
    nameSpans.forEach(nameSpan => {
        nameSpan.innerHTML = e.target.value + ', ';
    });
});