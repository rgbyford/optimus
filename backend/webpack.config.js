const fs = require('fs');
const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  mode: 'development',
  entry: './server/server.ts',
  devServer: {
    historyApiFallback: true
  },
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
      test: /\.tsx?$/, // include .js files
      enforce: "pre", // preload the jshint loader
      exclude: /node_modules/, // exclude any and all files in the node_modules folder
      use: [{
        loader: 'awesome-typescript-loader'
        // more options in the optional jshint object
        //options: {  // ⬅ formally jshint property
        //  camelcase: true,
        //  emitErrors: false,
        //  failOnHint: false
        //}
      }]
    }]
  },
  target: 'node',
  // the webpack config just works
node: {
  __dirname: false,
  __filename: false,
},
  externals: nodeModules,
  plugins: [
    new NodemonPlugin()
  ]
};
