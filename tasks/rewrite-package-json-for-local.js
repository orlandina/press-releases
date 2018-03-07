const fs = require('fs');
const packageJson = require('../package.json');
const packageLockJson = require('../package-lock.json');

const modulesToRemove = ['imagemin-mozjpeg', 'imagemin-webp', 'mozjpeg', 'cwebp-bin'];

modulesToRemove.forEach(module => delete packageJson.dependencies[module]);
modulesToRemove.forEach(module => delete packageLockJson.dependencies[module]);

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
fs.writeFileSync('./package-lock.json', JSON.stringify(packageLockJson, null, 2));
