import ENV from 'dotenv';
import Webpack from 'webpack';
import WebpackDev from 'webpack-dev-middleware';
import WebpackHotReplacement from 'webpack-hot-middleware';
import WebpackConfigs from '../../webpack.config.babel';
// webpack hot module replacement

ENV.config();

const env = process.env.MODE || 'dev';
const webpackConfig = WebpackConfigs(env);
const compiler = Webpack(webpackConfig);

export default {
  webpackDev: WebpackDev(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }),

  webpackHotReplacement: WebpackHotReplacement(compiler, { reload: true }),
};
