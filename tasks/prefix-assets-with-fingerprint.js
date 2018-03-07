const fs = require('fs');

const md5File = require('md5-file/promise');
const promisify = require('util.promisify');

const renameAsync = promisify(fs.rename);

const cssSourceFilename = 'public/assets/press/css/main.css';
const jsSourceFilename = 'public/assets/press/js/main.js';

const assetsFilenames = [cssSourceFilename, jsSourceFilename];

module.exports = Promise.all(assetsFilenames.map(md5File))
.then(([cssHash, jsHash]) => Promise.all([
  renameAsync(cssSourceFilename, `public/assets/press/css/main.${cssHash}.css`),
  renameAsync(jsSourceFilename, `public/assets/press/js/main.${jsHash}.js`)
]));
