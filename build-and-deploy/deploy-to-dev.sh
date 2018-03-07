set -e

PROJECT_NAME=press-releases
DOCKER_IMAGE_NAME=544725753551.dkr.ecr.eu-west-1.amazonaws.com/$PROJECT_NAME

$(aws ecr get-login --no-include-email --region eu-west-1)
docker pull $DOCKER_IMAGE_NAME:latest || true
docker ps -a | grep $PROJECT_NAME && docker rm -f $PROJECT_NAME
docker create --name $PROJECT_NAME $DOCKER_IMAGE_NAME:latest
rm -rf ./public
docker cp $PROJECT_NAME:/home/public ./public
docker rm -f $PROJECT_NAME

aws s3 sync public/assets "s3://as24-$PROJECT_NAME-as24dev/assets" --delete --acl public-read --cache-control "max-age=2592000"
aws s3 sync public/press "s3://as24-$PROJECT_NAME-as24dev/press" --delete --acl public-read --cache-control "max-age=300"
aws s3 cp public/redirect-definitions.json "s3://as24-$PROJECT_NAME-as24dev/" --acl public-read

# TODO: Get rid of manually installing packages
npm i glob util.promisify aws-sdk minimist --no-save
node ./tasks/upload-redirect-objects.js --s3-bucket-name=as24-press-releases-as24dev
