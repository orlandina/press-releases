FROM node:alpine

LABEL maintainer="#AS24-ThatsClassified-ds@scout24.com"

WORKDIR home

RUN apk add --update wget openssh-client ca-certificates git nasm g++ autoconf automake make libtool libjpeg-turbo-dev

RUN wget -O ./hugo.tar.gz https://github.com/gohugoio/hugo/releases/download/v0.34/hugo_0.34_Linux-64bit.tar.gz
RUN tar xzf ./hugo.tar.gz -C /usr/local/ && ln -s /usr/local/hugo /usr/local/bin/hugo

RUN mkdir ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm i

COPY ./ ./

RUN node tasks/build.js
