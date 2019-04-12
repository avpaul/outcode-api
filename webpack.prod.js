import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import Uglifyjs from 'uglifyjs-webpack-plugin';
import CleanWebpack from 'clean-webpack-plugin';


export default {
  devtool: 'source-map',
  mode: 'production',
  entry: ['./src/js/main.js'],
  output: {
    path: path.resolve(__dirname, 'dist', 'build'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/build/',
  },
  resolve: {
    symlinks: false,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      minChunks: 1,
      name: true,
      cacheGroups: {
        editor: {
          test: /[\\/]src[\\/]vendorjs[\\/]ckeditor/,
          name: 'editor',
          chunks: 'all',
        },

        jquery: {
          test: /[\\/]src[\\/]vendorjs[\\/]jquery/,
          name: 'jquery',
          chunks: 'all',
        },
        materialize: {
          test: /[\\/]src[\\/]vendorjs[\\/]materialize/,
          name: 'materialize',
          chunks: 'all',
        },
        popper: {
          test: /[\\/]src[\\/]vendorjs[\\/]popper/,
          name: 'popper',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      new Uglifyjs({
        exclude: ['./node_modules', './app_api', './app_server', './app.js'],
        sourceMap: true,
        cache: true,
        parallel: true,
      }),
    ],
  },
  plugins: [
    new CleanWebpack('./dist/build/', {}),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new webpack.ProvidePlugin({
      $: path.join(__dirname, '/src', '/vendorjs', 'jquery-3.3.1.min'),
      jQuery: path.join(__dirname, '/src', '/vendorjs', 'jquery-3.3.1.min'),
      jquery: path.join(__dirname, '/src', '/vendorjs', 'jquery-3.3.1.min'),
      'window.jQuery': path.join(__dirname, '/src', '/vendorjs', 'jquery-3.3.1.min'),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {

    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname, '/src', 'js'),
      use: [{
        loader: 'babel-loader?cacheDirectory',
      }],
    }, {
      test: /\.(png|gif|jpg|jpeg|eot|otf|woff|woff2|ttf)$/,
      use: [{
        loader: 'file-loader',
        outputpath: '/assets',
      }],
    },
    {
      test: /\.(css)/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
      ],
    },
    {
      test: /\.(scss)$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        'sass-loader',
      ],
    },
    ],
  },
};
