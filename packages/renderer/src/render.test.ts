import type { DeckGoal } from '@lemonppt/core';
import { describe, expect, it } from 'vitest';
import { renderDeck } from './render.js';

const sampleGoal: DeckGoal = {
  title: '测试渲染',
  goal: '测试',
  audience: '开发者',
  theme: 'minimal',
  language: 'zh',
  pageCount: 2,
  slides: [
    { role: 'cover' as const, layout: 'minimal_cover_v1', props: { title: '封面' } },
    { role: 'closing' as const, layout: 'minimal_closing_v1', props: { title: '结尾' } },
  ],
};

describe('renderDeck', () => {
  it('should return html and assets', () => {
    const result = renderDeck(sampleGoal);
    expect(result.html).toContain('<!DOCTYPE html>');
    expect(result.html).toContain('测试渲染');
    expect(result.assets).toContain('./assets/minimal.css');
  });

  it('should render correct number of slide wrappers', () => {
    const result = renderDeck(sampleGoal);
    expect(result.html.match(/class="lp-slide-wrapper/g)?.length).toBe(2);
  });

  it('should include editor bar when editable', () => {
    const result = renderDeck(sampleGoal, { editable: true });
    expect(result.html).toContain('<div class="lp-editor-bar">');
    expect(result.html).toContain('window.__lemonPPT_goal');
  });

  it('should not include editor bar by default', () => {
    const result = renderDeck(sampleGoal);
    expect(result.html).not.toContain('<div class="lp-editor-bar">');
  });
});
