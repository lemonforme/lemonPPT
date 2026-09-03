// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { extname, resolve, join } from 'node:path';

const mimeTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
};

export interface PreviewServer {
  url: string;
  close: () => Promise<void>;
}

/**
 * 启动本地 HTTP 服务器，用于替换 file:// 协议预览/导出。
 */
export async function startPreviewServer(rootDir: string, port = 0): Promise<PreviewServer> {
  const root = resolve(rootDir);

  const server = createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === '/') {
      for (const fallback of ['index.html', 'editor.html']) {
        try {
          const s = await stat(join(root, fallback));
          if (s.isFile()) {
            pathname = '/' + fallback;
            break;
          }
        } catch {}
      }
    }

    const filePath = join(root, pathname);
    if (!filePath.startsWith(root + '/') && filePath !== root) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    try {
      const s = await stat(filePath);
      if (!s.isFile()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const data = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      const address = server.address();
      const actualPort = typeof address === 'object' && address ? address.port : port;
      resolve({
        url: `http://localhost:${actualPort}`,
        close: () =>
          new Promise<void>((res, rej) => {
            server.close((err) => (err ? rej(err) : res()));
          }),
      });
    });
    server.on('error', reject);
  });
}
