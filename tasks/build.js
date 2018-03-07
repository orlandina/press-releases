const childProcess = require('child_process');

const glob = require('glob');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const rimraf = require('rimraf');
const s3WebsiteTasks = require('s3-website-tasks');
const promisify = require('util.promisify');

const execAsync = command => new Promise((resolve, reject) => {
  childProcess.exec(command, (error, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stdout) console.log(stderr);
    if (error) reject(error);
    else resolve(stdout);
  });
});
const globAsync = promisify(glob);
const rimrafAsync = promisify(rimraf);

module.exports = rimrafAsync('public/*')
.then(() => console.log('execute webpack'))
.then(() => require('./run-webpack-compiler'))
.then(() => console.log('done executing webpack'))
.then(() => console.log('add fingerprints to assets'))
.then(() => require('./prefix-assets-with-fingerprint'))
.then(() => console.log('done adding fingerprints'))
.then(() => console.log('execute hugo'))
.then(() => globAsync('public/assets/press/@(css|js)/*.@(css|js)'))
.then(filenames => {
  const cssHash = filenames.find(filename => filename.includes('.css')).match(/([^.]+)\.css$/)[1];
  const jsHash = filenames.find(filename => filename.includes('.js')).match(/([^.]+)\.js/)[1];
  return execAsync(
    `MAIN_CSS_SUFFIX=.${cssHash} MAIN_JS_SUFFIX=.${jsHash} hugo --config config.yaml`
  );
})
.then(() => console.log('done executing hugo'))
.then(() => console.log('optimize images'))
.then(() => s3WebsiteTasks.minifyImages({
  srcPath: 'images', destPath: 'public/assets/press/images',
  imageminPlugins: [imageminWebp, imageminMozjpeg],
  reportingCallback: console.log
}))
.then(() => console.log('done optimizing images'))
.then(() => console.log('rename language folders'))
.then(() => require('./add-fqdn-to-language-folders'))
.then(() => console.log('done renaming language folders'))
.then(() => console.log('check for internal dead links'))
.then(() => s3WebsiteTasks.checkForInternalDeadLinks({
  rootFolder: 'public', secondLevelDomain: 'autoscout24', pathPrefixes: ['press']
}))
.then(deadLinksByFiles => {
  if (deadLinksByFiles.length > 0) {
    console.log(s3WebsiteTasks.createDeadLinksReport(deadLinksByFiles));
    process.exit(1);
  }
})
.then(() => console.log('done checking for internal dead links'))
.then(() => console.log('create redirect definitions'))
.then(() => require('./create-redirect-definitions'))
.then(() => console.log('done creating redirect definitions'))
.catch(error => setTimeout(() => {throw error;}, 0));
