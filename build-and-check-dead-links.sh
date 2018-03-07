set -e

npm i --no-save
node tasks/build-and-check-dead-links
