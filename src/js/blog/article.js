$('.add-comment').on('click', () => {
    console.log($('.comment-textarea').value);
});
if (module.hot) {
    module.hot.accept();
}