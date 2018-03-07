set -e

# TODO: Get rid of manually installing packages
npm i glob util.promisify aws-sdk s3-website-tasks minimist --no-save
node tasks/configure-stack.js --configuration=$1
