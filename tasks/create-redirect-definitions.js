const {writeFile} = require('fs');

const s3WebsiteTasks = require('s3-website-tasks');
const promisify = require('util.promisify');

const writeFileAsync = promisify(writeFile);

module.exports = Promise.all([
  s3WebsiteTasks.createTrailingSlashRedirectDefinitions('public'),
  s3WebsiteTasks.createCustomRedirectDefinitions('redirects')
])
.then(([trailingSlashRedirects, customRedirects]) => trailingSlashRedirects.concat(customRedirects))
.then(redirectDefinitions => writeFileAsync('public/redirect-definitions.json', JSON.stringify(redirectDefinitions, null, 2)));
