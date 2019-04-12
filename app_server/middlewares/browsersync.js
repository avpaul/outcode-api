import BrowserSync from 'browser-sync';
import ConnectBrowser from 'connect-browser-sync';

const browserSync = BrowserSync.create().init({
  port: 3001,
  proxy: 'localhost:3000',
  logSnippet: false,
  online: false,
  files: ['../../app_server/routes', '../../app_server/controllers', '../../app_api'],
  logConnections: true,
  tunnel: true,
  ghostMode: {
    clicks: true,
    forms: true,
    scroll: true,
  },
  // browser: 'google chrome',
  plugins: [{
    module: 'bs-html-injector',
    options: {
      files: ['../../app_server/views/blog/**.pug', '../../app_server/views/admin/**.pug'],
    },
  }],
});

export default ConnectBrowser(browserSync, { injectHead: true });
