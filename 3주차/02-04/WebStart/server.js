let http = require('http');
let url = require('url');

function start(route, handle) {
  function onRequest(request, response) {
    let pathname = url.parse(request.url).pathname;
    
    if (pathname === '/favicon.ico') {
      response.writeHead(204);
      response.end();
      return;
    }
    
    route(pathname, handle);
    
    response.writeHead(200, {'Content-type' : 'text/html'});
    response.write('Hello Node.js By hightuv');
    response.end();
  }
  
  http.createServer(onRequest).listen(8888);
  // localhost:8888
}

exports.start = start;
