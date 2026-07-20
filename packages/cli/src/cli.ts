#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  exportGoalToPdf,
  exportGoalToPptx,
  generateGoalToFile,
  readGoalFromFile,
  renderGoalToDir,
} from './index.js';
import { installSkill } from './install-skill.js';

function printUsage(): void {
  console.log(`Usage:
  lemonppt generate "<input>" [--pages N] [--theme <id>] [--language zh|en] [--out goal.json] [--api-key KEY]
  lemonppt render <goal.json> [--out ./output] [--editable]
  lemonppt export <goal.json> --pptx out.pptx [--pdf out.pdf]
  lemonppt install-skill [--claude] [--codex] [--cursor] [--all]
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
