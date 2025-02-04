function route(pathname, handle, response) {
  /* if (pathname === '/favicon.ico') {
    response.writeHead(204);
    response.end();
    return;
  }
   */
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response);
  } else {
    response.writeHead(404);
    response.write('Not Found');
    response.end();
  }
  console.log('pathname : ' + pathname);
}

exports.route = route;
