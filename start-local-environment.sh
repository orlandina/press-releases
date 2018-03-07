set -e

NAME=press-releases

docker rm -f $NAME || true

docker build \
  --cache-from $NAME:latest \
  --tag $NAME:latest \
  --file Dockerfile.local \
  .

docker run \
  -d \
  --name $NAME \
  -v $(pwd)/themes:/home/themes/ \
  -v $(pwd)/content:/home/content/ \
  $NAME:latest \
  node tasks/start-local-environment

$(aws ecr get-login --no-include-email --region eu-west-1)
docker rm -f as24_jigsaw || true
docker pull 544725753551.dkr.ecr.eu-west-1.amazonaws.com/jigsaw
docker run \
  -d \
  --name as24_jigsaw \
  -p 8080:80 \
  --link $NAME:$NAME \
  --env ACCOUNTSUBDOMAIN="a" \
  544725753551.dkr.ecr.eu-west-1.amazonaws.com/jigsaw
docker cp ./adapt-jigsaw.sh as24_jigsaw:/root/
docker exec as24_jigsaw chmod +x /root/adapt-jigsaw.sh
docker exec as24_jigsaw sh /root/adapt-jigsaw.sh
