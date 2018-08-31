     $('#signIn').on('click', () => {
         if (!('#password').value && !('#email').value) {
             console.log('fill in your idedinty men');
         }
     })

     if (module.hot) {
         module.hot.accept();
     }