const fs = require('fs');

const config = fs.readFileSync('config.yaml').toString();

const localConfig = config
.replace(/https:\/\/www\.autoscout24\.[^/]+\/assets\/press\/.*$/gm, 'http://localhost:8080/assets/press/')
.replace(/https:\/\/www\.autoscout24\.([^/]*?)\/press/g, 'http://localhost:8080/press/$1')
.replace(/https:\/\/www\.autoscout24\.be\/([^/]*?)\/press/g, 'http://localhost:8080/press/be/$1')
.replace('environment: live', 'environment: local');

fs.writeFileSync('config.local.yaml', localConfig);
