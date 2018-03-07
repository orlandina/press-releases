const fs = require('fs');

const parseArgs = require('minimist');
const s3WebsiteTasks = require('s3-website-tasks');
const promisify = require('util.promisify');

const argv = parseArgs(process.argv);
const configuration = argv['configuration'];

if (!configuration) throw new Error('invalid configuration');

const readFileAsync = promisify(fs.readFile);

const stackName = configuration == 'ecr' ? 'press-releases-ecr' : 'press-releases';

module.exports = readFileAsync(`./build-and-deploy/${configuration}-stack.yaml`)
.then(buffer => buffer.toString())
.then(cloudFormationTemplate => s3WebsiteTasks.createOrUpdateStack(
  {stackName: stackName, cloudFormationTemplate, region: 'eu-west-1'}
))
.then(report => {
  console.log(JSON.stringify(report.events, null, 2));
  if (!report.wasSuccessful) throw new Error('create or update stack was not successful');
})
.catch(error => {
  setTimeout(() => {throw error;}, 0);
});
