var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname + "/public/",
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: "eslint-loader",
      exclude: /node_modules/
    }],
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  eslint: {
    configFile: '.eslintrc'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './public/'
  }
};
