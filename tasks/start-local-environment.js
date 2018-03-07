const childProcess = require('child_process');

const webpack = require('webpack');
const s3WebsiteTasks = require('s3-website-tasks');

const webpackCompiler = webpack(require('../webpack.config'));

const imageminCopyOnly = () => buffer => Promise.resolve(buffer);

require('./start-local-http-server');

s3WebsiteTasks.minifyImages({
  srcPath: 'images', destPath: 'public/assets/press/images',
  imageminPlugins: [imageminCopyOnly],
  reportingCallback: console.log
});

require('./rewrite-hugo-config-for-local');
childProcess.spawn('hugo', ['--config', 'config.local.yaml', '--watch'], {stdio: 'inherit'});

webpackCompiler.watch({poll: 1000}, (error, stats) => {
  console.log(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }));
});
