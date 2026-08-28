import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';

const port = 4321;
const host = '127.0.0.1';
const distDirectory = resolve('dist');
const configuredBase = process.env.SITE_BASE || '/';
const base = configuredBase === '/' ? '/' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`;
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', `http://${host}`).pathname);
  if (!pathname.startsWith(base)) {
    response.writeHead(404).end('Niet gevonden');
    return;
  }

  const relativePath = pathname.slice(base.length).replace(/^\/+/, '');
  let filePath = resolve(distDirectory, relativePath || 'index.html');
  if (filePath !== distDirectory && !filePath.startsWith(`${distDirectory}${sep}`)) {
    response.writeHead(400).end('Ongeldig pad');
    return;
  }

  try {
    const fileStats = await stat(filePath);
    if (fileStats.isDirectory()) {
      filePath = resolve(filePath, 'index.html');
      await stat(filePath);
    }
    response.writeHead(200, {
      'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404).end('Niet gevonden');
  }
});

server.listen(port, host, () => {
  console.log(`Testserver luistert op http://${host}:${port}${base}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
