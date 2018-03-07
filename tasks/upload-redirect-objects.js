const aws = require('aws-sdk');
const parseArgs = require('minimist');
const promisify = require('util.promisify');

const argv = parseArgs(process.argv);
const s3BucketName = argv['s3-bucket-name'];

if (!s3BucketName) throw new Error('invalid s3 bucket');

const s3 = new aws.S3();
const putObjectAsync = promisify(s3.putObject.bind(s3));

const redirectDefinitions = require('../public/redirect-definitions.json');

module.exports = Promise.all(redirectDefinitions.map(redirectDefinition => putObjectAsync({
  Body: '',
  Bucket: s3BucketName,
  Key: redirectDefinition.s3Key,
  WebsiteRedirectLocation: redirectDefinition.redirectUrl
})));
