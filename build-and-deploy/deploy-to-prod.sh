set -e

aws s3 sync s3://as24-press-releases-as24dev s3://as24-press-releases-as24prod --delete

rm -rf public && mkdir public
aws s3 cp s3://as24-press-releases-as24dev/redirect-definitions.json ./public/

# TODO: Get rid of manually installing packages
npm i glob util.promisify aws-sdk minimist --no-save
node ./tasks/upload-redirect-objects.js --s3-bucket-name=as24-press-releases-as24prod
