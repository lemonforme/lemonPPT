#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 查看指定版式的字段契约
 * 用法:
 *   node scripts/inspect-layout.mjs theme06_metric_hero_v1
 *   node scripts/inspect-layout.mjs theme06_metric_hero_v1 --compact
 */
import { getLayout, getLayoutSchema } from '@lemonppt/templates';

function parseArgs(argv) {
  const options = {};
  const positional = [];
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
  return { options, positional };
}

function simplifyField(field) {
  const out = {
    key: field.key,
    label: field.label,
    type: field.type,
  };
  if (field.defaultValue !== undefined) out.defaultValue = field.defaultValue;
  if (field.inlineEditable) out.inlineEditable = true;
  if (field.group) out.group = field.group;
  if (field.options) out.options = field.options;
  if (field.min !== undefined) out.min = field.min;
  if (field.max !== undefined) out.max = field.max;
  if (field.minItems !== undefined) out.minItems = field.minItems;
  if (field.maxItems !== undefined) out.maxItems = field.maxItems;
  if (field.visibleWhen) out.visibleWhen = field.visibleWhen;
  if (field.itemSchema) {
    out.itemSchema = field.itemSchema.map(simplifyField);
  }
  return out;
}

function buildFillPlan(schema) {
  const text = [];
  const arrays = [];
  const images = [];
  const booleans = [];
  const selects = [];

  function walk(fields, prefix = '') {
    for (const f of fields || []) {
      const key = prefix ? `${prefix}.${f.key}` : f.key;
      if (f.type === 'array') {
        arrays.push({
          key,
          label: f.label,
          minItems: f.minItems,
          maxItems: f.maxItems,
          itemSchema: (f.itemSchema || []).map((i) => ({ key: i.key, label: i.label, type: i.type })),
        });
      } else if (f.type === 'image') {
        images.push({ key, label: f.label });
      } else if (f.type === 'boolean') {
        booleans.push({ key, label: f.label, defaultValue: f.defaultValue });
      } else if (f.type === 'select') {
        selects.push({ key, label: f.label, options: f.options, defaultValue: f.defaultValue });
      } else if (f.type === 'object') {
        walk(f.itemSchema || [], key);
      } else {
        text.push({
          key,
          label: f.label,
          type: f.type,
          inlineEditable: f.inlineEditable,
          defaultValue: f.defaultValue,
        });
      }
    }
  }

  walk(schema.fields);
  return { text, arrays, images, booleans, selects };
}

function main() {
  const { options, positional } = parseArgs(process.argv.slice(2));
  const layoutId = positional[0];
  const compact = options.compact === true;

  if (!layoutId) {
    console.error('Error: layoutId is required.');
    console.error('Usage: node scripts/inspect-layout.mjs <layoutId> [--compact]');
    process.exit(1);
  }

  const layout = getLayout(layoutId);
  const schema = getLayoutSchema(layoutId);

  if (!layout || !schema) {
    console.error(`Error: layout "${layoutId}" not found.`);
    process.exit(1);
  }

  const meta = layout.meta;

  if (compact) {
    console.log(JSON.stringify({
      layout: meta.id,
      displayName: meta.displayName,
      theme: meta.theme,
      role: meta.role,
      description: meta.description || '',
      needsMedia: meta.needsMedia,
      mediaSlots: meta.mediaSlots || [],
      tags: meta.tags || [],
      contentShape: meta.contentShape || '',
      fillPlan: buildFillPlan(schema),
    }, null, 2));
    return;
  }

  const result = {
    layout: meta.id,
    displayName: meta.displayName,
    theme: meta.theme,
    role: meta.role,
    description: meta.description || '',
    needsMedia: meta.needsMedia,
    mediaSlots: meta.mediaSlots || [],
    tags: meta.tags || [],
    contentShape: meta.contentShape || '',
    fields: schema.fields.map(simplifyField),
    fillPlan: buildFillPlan(schema),
  };

  console.log(JSON.stringify(result, null, 2));
}

main();
