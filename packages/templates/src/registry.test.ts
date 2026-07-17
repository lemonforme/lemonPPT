import { describe, expect, it } from 'vitest';
import { getLayout, listLayouts, listLayoutsByRole, renderSlide } from './registry.js';

describe('registry', () => {
  it('should register all built-in layouts', () => {
    const layouts = listLayouts();
    expect(layouts.length).toBeGreaterThanOrEqual(23);
    const ids = layouts.map((l) => l.id);
    expect(ids).toContain('minimal_cover_v1');
    expect(ids).toContain('minimal_chart_v1');
    expect(ids).toContain('minimal_image_v1');
  });

  it('should find a registered layout', () => {
    const layout = getLayout('minimal_cover_v1');
    expect(layout).toBeDefined();
    expect(layout?.meta.role).toBe('cover');
  });

  it('should return undefined for unknown layout', () => {
    expect(getLayout('unknown_layout')).toBeUndefined();
  });

  it('should filter layouts by role', () => {
    const coverLayouts = listLayoutsByRole('cover');
    expect(coverLayouts.length).toBeGreaterThanOrEqual(1);
    expect(coverLayouts.every((l) => l.role === 'cover')).toBe(true);
  });

  it('should render a known slide', () => {
    const element = renderSlide({ layout: 'minimal_cover_v1', props: { title: 'Hi' } });
    expect(element).not.toBeNull();
  });

  it('should return null for unknown slide layout', () => {
    const element = renderSlide({ layout: 'nonexistent', props: {} });
    expect(element).toBeNull();
  });
});
