#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createServer as createHttpServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { stat, readFile } from 'node:fs/promises';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  exportGoalToPdf,
  exportGoalToPptx,
  generateGoalToFile,
  inspectLayout,
  listThemes,
  queryLayouts,
  readGoalFromFile,
  renderGoalToDir,
  scaffoldGoalToFile,
  validateGoalSpec,
  writeSafePropsToFile,
} from './index.js';
import { installSkill } from './install-skill.js';

function printUsage(): void {
  console.log(`Usage:
  lemonppt generate "<input>" [--pages N] [--theme <id>] [--language zh|en] [--out goal.json] [--api-key KEY]
  lemonppt render <goal.json> [--out ./output] [--editable]
  lemonppt export <goal.json> --pptx out.pptx [--pdf out.pdf]
  lemonppt serve [<dir>] [--port N]   # start API server if built, else static preview
  lemonppt server [<dir>] [--port N]  # alias for serve
  lemonppt install-skill [--claude] [--codex] [--cursor] [--all]

  lemonppt list-themes
  lemonppt layout-query --theme <id> --role <role> [--keyword K] [--needs-media] [--limit N] [--seed S]
  lemonppt inspect-layout <layoutId> [--compact]
  lemonppt goal-scaffold --title T --goal G --theme <id> --pages N [--out goal.json]
  lemonppt write-safe-props <goal.json> [--write]
  lemonppt validate-goal-spec <goal.json> [--strict]
`);
}

interface ParsedArgs {
  positional: string[];
  options: Record<string, string | boolean>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const positional: string[] = [];
  const options: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.replace(/^--/, '');
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        options[key] = next;
        i++;
      } else {
        options[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { positional, options };
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../../..');
const apiServerPath = join(projectRoot, 'apps/server/dist/index.js');

async function startApiServer(dir: string, port: number): Promise<void> {
  if (!existsSync(apiServerPath)) {
    throw new Error(
      `API server not found at ${apiServerPath}. Run 'pnpm -r build' first.`,
    );
  }
  const child = spawn('node', [apiServerPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      LEMONPPT_PORT: String(port),
      LEMONPPT_OUTPUT_DIR: resolve(dir),
    },
  });
  return new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`API server exited with code ${code}`));
    });
  });
}

async function serveDir(dir: string, port: number): Promise<void> {
  const root = resolve(dir);
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

  const server = createHttpServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === '/') {
      // 优先 editable 输出（editor.html），回退到非 editable 输出（index.html）
      for (const fallback of ['editor.html', 'index.html']) {
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

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Serving ${root} at http://localhost:${port}`);
      resolve();
    });
  });
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    printUsage();
    process.exit(0);
  }

  const command = argv[0];
  const args = parseArgs(argv.slice(1));
  const positional = args.positional;

  try {
    switch (command) {
      case 'generate': {
        const input = positional[0];
        if (!input) {
          console.error('Error: generate command requires an input string.');
          process.exit(1);
        }
        const goal = await generateGoalToFile({
          input,
          pageCount: args.options.pages ? Number(args.options.pages) : 8,
          theme: args.options.theme as string,
          language: args.options.language as 'zh' | 'en',
          apiKey: args.options['api-key'] as string,
          baseUrl: args.options['base-url'] as string,
          model: args.options.model as string,
          outFile: (args.options.out as string) || './goal.json',
        });
        console.log(`Generated goal: ${goal.title} (${goal.slides.length} slides)`);
        break;
      }

      case 'render': {
        const goalPath = positional[0];
        if (!goalPath) {
          console.error('Error: render command requires a goal.json path.');
          process.exit(1);
        }
        const goal = await readGoalFromFile(goalPath);
        const { indexPath } = await renderGoalToDir(goal, {
          outDir: (args.options.out as string) || './output',
          editable: args.options.editable === true,
        });
        console.log(`Rendered to ${indexPath}`);
        break;
      }

      case 'export': {
        const goalPath = positional[0];
        if (!goalPath) {
          console.error('Error: export command requires a goal.json path.');
          process.exit(1);
        }
        const goal = await readGoalFromFile(goalPath);
        if (args.options.pptx) {
          await exportGoalToPptx(goal, { outFile: args.options.pptx as string });
          console.log(`Exported PPTX to ${args.options.pptx}`);
        }
        if (args.options.pdf) {
          await exportGoalToPdf(goal, { outFile: args.options.pdf as string });
          console.log(`Exported PDF to ${args.options.pdf}`);
        }
        if (!args.options.pptx && !args.options.pdf) {
          console.error('Error: export command requires --pptx or --pdf.');
          process.exit(1);
        }
        break;
      }

      case 'serve':
      case 'server': {
        const dir = positional[0] || './output';
        const port = args.options.port ? Number(args.options.port) : 3456;
        if (existsSync(apiServerPath)) {
          console.log(`Starting API server on port ${port}...`);
          await startApiServer(dir, port);
        } else {
          console.log(`API server not built, falling back to static preview.`);
          await serveDir(dir, port);
          // 保持进程运行
          await new Promise(() => {});
        }
        break;
      }

      case 'list-themes': {
        const themes = listThemes();
        console.log(JSON.stringify(themes, null, 2));
        break;
      }

      case 'layout-query': {
        const theme = args.options.theme as string;
        const role = args.options.role as string;
        if (!theme || !role) {
          console.error('Error: layout-query requires --theme and --role.');
          process.exit(1);
        }
        const result = queryLayouts({
          theme,
          role,
          keyword: args.options.keyword as string | undefined,
          needsMedia: args.options['needs-media'] === true,
          limit: args.options.limit ? Number(args.options.limit) : 8,
          seed: args.options.seed as string | undefined,
        });
        console.log(JSON.stringify(result, null, 2));
        break;
      }

      case 'inspect-layout': {
        const layoutId = positional[0];
        if (!layoutId) {
          console.error('Error: inspect-layout requires a layoutId.');
          process.exit(1);
        }
        const info = inspectLayout(layoutId);
        if (!info) {
          console.error(`Error: layout "${layoutId}" not found.`);
          process.exit(1);
        }
        if (args.options.compact === true) {
          console.log(JSON.stringify({
            layout: info.layout,
            displayName: info.displayName,
            role: info.role,
            description: info.description,
            needsMedia: info.needsMedia,
            mediaSlots: info.mediaSlots,
            tags: info.tags,
            contentShape: info.contentShape,
            fields: info.fields,
          }, null, 2));
        } else {
          console.log(JSON.stringify(info, null, 2));
        }
        break;
      }

      case 'goal-scaffold': {
        const title = args.options.title as string;
        const goal = args.options.goal as string;
        if (!title || !goal) {
          console.error('Error: goal-scaffold requires --title and --goal.');
          process.exit(1);
        }
        const result = await scaffoldGoalToFile({
          title,
          goal,
          audience: args.options.audience as string | undefined,
          owner: args.options.owner as string | undefined,
          theme: args.options.theme as string,
          pages: args.options.pages ? Number(args.options.pages) : 8,
          language: args.options.language as 'zh' | 'en' | undefined,
          seed: args.options.seed as string | undefined,
          outFile: (args.options.out as string) || './goal.json',
        });
        console.log(`Scaffolded goal: ${result.title} (${result.slides.length} slides)`);
        break;
      }

      case 'write-safe-props': {
        const goalPath = positional[0];
        if (!goalPath) {
          console.error('Error: write-safe-props requires a goal.json path.');
          process.exit(1);
        }
        const result = await writeSafePropsToFile({
          goalPath,
          write: args.options.write === true,
        });
        if (args.options.write !== true) {
          console.log(JSON.stringify({
            valid: result.valid,
            layoutChanges: result.layoutChanges,
            unknownFields: result.unknownFields,
          }, null, 2));
        } else {
          console.log(`Safe props written to ${goalPath}`);
          if (result.layoutChanges.length > 0) {
            console.warn(`Layout changes: ${result.layoutChanges.length}`);
          }
          if (result.unknownFields.length > 0) {
            console.warn(`Unknown fields: ${result.unknownFields.length}`);
          }
        }
        break;
      }

      case 'validate-goal-spec': {
        const goalPath = positional[0];
        if (!goalPath) {
          console.error('Error: validate-goal-spec requires a goal.json path.');
          process.exit(1);
        }
        const result = await validateGoalSpec(goalPath, args.options.strict === true);
        console.log(JSON.stringify(result, null, 2));
        if (!result.valid) {
          process.exit(1);
        }
        break;
      }

      case 'install-skill': {
        const agents: string[] = [];
        if (args.options.claude) agents.push('claude');
        if (args.options.codex) agents.push('codex');
        if (args.options.cursor) agents.push('cursor');
        if (args.options.all || agents.length === 0) {
          agents.length = 0;
          agents.push('claude', 'codex', 'cursor');
        }
        await installSkill({ agents });
        break;
      }

      default: {
        console.error(`Unknown command: ${command}`);
        printUsage();
        process.exit(1);
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

void main();
