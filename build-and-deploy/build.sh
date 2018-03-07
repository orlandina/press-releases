set -e

PROJECT_NAME=press-releases
DOCKER_IMAGE_NAME=544725753551.dkr.ecr.eu-west-1.amazonaws.com/$PROJECT_NAME

touch -t 200001010000.00 package.json
touch -t 200001010000.00 package-lock.json

$(aws ecr get-login --no-include-email --region eu-west-1)
docker pull $DOCKER_IMAGE_NAME:latest || true
docker build --cache-from $DOCKER_IMAGE_NAME:latest --tag $DOCKER_IMAGE_NAME:latest .
docker push $DOCKER_IMAGE_NAME:latest
