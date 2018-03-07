const promisify = require('util.promisify');

const webpack = require('webpack');

const webpackCompiler = webpack(require('../webpack.config'));

const compileRunAsync = promisify(webpackCompiler.run.bind(webpackCompiler));

const getStatsResultString = stats => stats.toString({
  colors: true,
  modules: false,
  children: false,
  chunks: false,
  chunkModules: false
});

module.exports = compileRunAsync()
.then(stats => {
  if (stats.hasErrors()) {
    const info = stats.toJson();
    throw info.errors;
  }
  console.log(getStatsResultString(stats));
});
