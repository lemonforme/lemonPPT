import type { DeckGoal } from '@lemonppt/core';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createServer } from './server.js';

const sampleGoal: DeckGoal = {
  title: '测试渲染',
  goal: '测试',
  audience: '开发者',
  theme: 'minimal',
  language: 'zh',
  pageCount: 2,
  slides: [
    { role: 'cover' as const, layout: 'cover_v1', props: { title: '封面' } },
    { role: 'closing' as const, layout: 'closing_v1', props: { title: '结尾' } },
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
    expect(res.body.assets).toContain('./assets/minimal.css');
  });
});
