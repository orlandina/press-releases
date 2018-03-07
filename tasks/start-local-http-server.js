const http = require('http');

const nodeStatic = require('node-static');

const staticServer = new nodeStatic.Server('./public', {cache: 0});
http.createServer((request, response) => {
  request.url = request.url.replace(/press\/localhost\//, 'press/')
  .replace(/be\/(nl|fr)/, 'be/$1-be');
  request.addListener('end', () => staticServer.serve(request, response));
  request.resume();
}).listen(9000);
