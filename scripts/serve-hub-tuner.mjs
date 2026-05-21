import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.json': 'application/json; charset=utf-8'
};

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  const relativePath = cleanPath === '/' ? 'examples/browser/hub-tuner.html' : cleanPath.replace(/^\/+/, '');
  const absolutePath = resolve(root, normalize(relativePath));
  return absolutePath.startsWith(root) ? absolutePath : null;
}

const server = createServer((request, response) => {
  const requestPath = resolveRequestPath(request.url || '/');
  if (!requestPath || !existsSync(requestPath) || !statSync(requestPath).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'content-type': contentTypes[extname(requestPath)] || 'application/octet-stream',
    'cache-control': 'no-store'
  });
  createReadStream(requestPath).pipe(response);
});

server.listen(port, () => {
  console.log(`Hub tuner running at http://localhost:${port}/`);
  console.log(`Serving ${join(root, 'examples/browser/hub-tuner.html')}`);
});
