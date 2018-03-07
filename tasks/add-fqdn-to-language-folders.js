const fs = require('fs');

const promisify = require('util.promisify');
const glob = require('glob');

const renameAsync = promisify(fs.rename);
const globAsync = promisify(glob);

module.exports = globAsync('public/!(assets)/!(www)*/')
.then(directories => directories.map(
  directory => renameAsync(directory, directory.replace(/([^/]*\/)$/, 'www.autoscout24.$1'))
))
.then(() => globAsync('public/*/www.autoscout24.be/*'))
.then(directories => directories.map(
  directory => renameAsync(directory, directory.replace(/-be$/, ''))
));
