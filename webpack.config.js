const path = require('path');
const ClosurePlugin = require('closure-webpack-plugin');

module.exports = {
  entry: './out/App.js',
  mode: 'production',
  optimization: {
    minimizer: [
      new ClosurePlugin({ mode: 'STANDARD', platform: 'javascript' }, {}),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/out'),
    filename: 'App.js',
  },
};
