// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, it, expect, beforeAll } from 'vitest';
import * as PDFLib from 'pdf-lib';
import PptxGenJS from 'pptxgenjs';
import * as htmlToImage from 'html-to-image';
import { assemblePdfFromImages, assemblePptxFromImages } from './browser-export.js';

const tinyPng =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

beforeAll(() => {
  (globalThis as any).window = { PDFLib, PptxGenJS, htmlToImage };
  (globalThis as any).atob = (str: string) => Buffer.from(str, 'base64').toString('binary');
  (globalThis as any).btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');
});

describe('browser-export', () => {
  it('assemblePdfFromImages 生成合法 PDF base64', async () => {
    const result = await assemblePdfFromImages([tinyPng, tinyPng], {
      width: 1280,
      height: 720,
      title: 'Test PDF',
    });
    expect(result.mimeType).toBe('application/pdf');
    expect(result.filename).toBe('presentation.pdf');
    expect(result.base64.length).toBeGreaterThan(0);
    const bytes = Buffer.from(result.base64, 'base64');
    expect(bytes.toString('ascii', 0, 4)).toBe('%PDF');
  });

  it('assemblePptxFromImages 生成合法 PPTX base64', async () => {
    const result = await assemblePptxFromImages([tinyPng], {
      width: 1280,
      height: 720,
      title: 'Test PPTX',
    });
    expect(result.mimeType).toBe('application/vnd.openxmlformats-officedocument.presentationml.presentation');
    expect(result.filename).toBe('presentation.pptx');
    expect(result.base64.length).toBeGreaterThan(0);
    const bytes = Buffer.from(result.base64, 'base64');
    expect(bytes.readUInt16LE(0)).toBe(0x4b50); // PK
  });
});
