const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  const esBackend =
    req.url.startsWith('/api/') ||
    req.url.startsWith('/swagger-ui/') ||
    req.url.startsWith('/v3/api-docs');

  const target = esBackend ? 'http://localhost:8088' : 'http://localhost:5173';

  proxy.web(req, res, { target }, (err) => {
    console.error('Error de proxy:', err.message);
    if (!res.headersSent) {
      res.writeHead(502);
      res.end('Servicio no disponible');
    }
  });
});

server.listen(3000, () => {
  console.log('Proxy disponible en http://localhost:3000');
});
