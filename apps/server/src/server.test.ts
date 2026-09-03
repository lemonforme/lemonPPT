// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal } from '@lemonppt/core';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createServer } from './server.js';

const sampleGoal: DeckGoal = {
  title: '测试渲染',
  goal: '测试',
  audience: '开发者',
  theme: 'theme01',
  language: 'zh',
  pageCount: 2,
  slides: [
    { role: 'cover' as const, layout: 'cover_v1', props: { title: '封面' } },
    { role: 'closing' as const, layout: 'closing_v2', props: { title: '结尾' } },
  ],
};

describe('server', () => {
  const app = createServer({ port: 0, outputDir: '/tmp/lemonppt-test' });

  it('GET /api/health should return ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('POST /api/generate-goal should return fallback goal', async () => {
    const res = await request(app)
      .post('/api/generate-goal')
      .send({ input: '测试主题', pageCount: 5 });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.goal).toBeDefined();
    expect(res.body.goal.slides.length).toBe(5);
  });

  it('POST /api/render should render html', async () => {
    const res = await request(app).post('/api/render').send(sampleGoal);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.assets).toContain('./assets/theme01.css');
  });

  it('GET /api/render-editor should return EditorData', async () => {
    const res = await request(app).get('/api/render-editor?theme=theme02');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const data = res.body.data;
    expect(data).toBeDefined();
    expect(data.goal).toBeDefined();
    expect(data.theme).toBe('theme02');
    expect(data.slidesMarkup).toContain('lp-slide-wrapper');
    expect(data.themeCssVars).toContain('--');
    expect(data.colorScheme).toBeDefined();
  });

  it('POST /api/render-editor should honor body goal theme', async () => {
    const res = await request(app).post('/api/render-editor?theme=theme03').send(sampleGoal);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.theme).toBe('theme03');
    expect(res.body.data.goal.slides.length).toBe(sampleGoal.slides.length);
  });

  it('GET /editor should return single-page editor HTML', async () => {
    const res = await request(app).get('/editor?theme=theme02');
    expect(res.status).toBe(200);
    expect(res.text).toContain('editor.js');
    expect(res.text).toContain('lp-editor-root');
  });

  it('POST /api/export/pptx should return a PPTX blob', async () => {
    const res = await request(app).post('/api/export/pptx').send(sampleGoal);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/octet-stream|officedocument/);
    expect(res.headers['content-disposition']).toMatch(/\.pptx/);
    expect(Number(res.headers['content-length'])).toBeGreaterThan(1000);
  }, 30000);

  it('POST /api/export/pdf should return a PDF blob', async () => {
    const res = await request(app).post('/api/export/pdf').send(sampleGoal);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/octet-stream|pdf/);
    expect(res.headers['content-disposition']).toMatch(/\.pdf/);
    expect(Number(res.headers['content-length'])).toBeGreaterThan(1000);
  });
});
