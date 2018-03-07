const {execSync} = require('child_process');

const promisify = require('util.promisify');
const rimraf = require('rimraf');
const s3WebsiteTasks = require('s3-website-tasks');

const rimrafAsync = promisify(rimraf);

rimrafAsync('public/*')
.then(() => execSync('hugo', {stdio: 'inherit'}))
.then(() => require('./run-webpack-compiler'))
.then(() => s3WebsiteTasks.minifyImages({
  srcPath: 'images', destPath: 'public/assets/press/images',
  imageminPlugins: [() => buffer => Promise.resolve(buffer)],
  reportingCallback: console.log
}))
.then(() => require('./add-fqdn-to-language-folders'))
.then(() => s3WebsiteTasks.checkForInternalDeadLinks({
  rootFolder: 'public', secondLevelDomain: 'autoscout24', pathPrefixes: ['press']
}))
.then(deadLinksByFiles => console.log(
  s3WebsiteTasks.createDeadLinksReport(deadLinksByFiles)
));
