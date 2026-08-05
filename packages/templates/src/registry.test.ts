// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest';
import {
  getLayout,
  listLayouts,
  listLayoutsByRole,
  listLayoutsByRoleAndTheme,
  listLayoutsByTheme,
  renderSlide,
  resolveLayout,
} from './registry.js';

describe('registry', () => {
  it('should register all built-in layouts', () => {
    const layouts = listLayouts();
    expect(layouts.length).toBeGreaterThanOrEqual(23);
    const ids = layouts.map((l) => l.id);
    expect(ids).toContain('theme01_cover_v1');
    expect(ids).toContain('theme01_chart_v1');
    expect(ids).toContain('theme01_image_v1');
  });

  it('should find a registered layout', () => {
    const layout = getLayout('theme01_cover_v1');
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
    const element = renderSlide({ role: 'cover' as const, layout: 'theme01_cover_v1', props: { title: 'Hi' } });
    expect(element).not.toBeNull();
  });

  it('should return null for unknown slide layout and role', () => {
    const element = renderSlide({
      role: 'nonexistent_role' as never,
      layout: 'nonexistent',
      props: {},
    });
    expect(element).toBeNull();
  });

  it('should resolve layout by role and theme', () => {
    const layout = resolveLayout('cover', 'theme01');
    expect(layout).toBeDefined();
    expect(layout?.meta.role).toBe('cover');
    expect(layout?.meta.id).toBe('theme01_cover_v1');
  });

  it('should return undefined when theme-specific variant is absent', () => {
    expect(resolveLayout('cover', 'unknown_theme')).toBeUndefined();
  });

  it('should list layouts by role and theme', () => {
    const coverLayouts = listLayoutsByRoleAndTheme('cover', 'theme01');
    expect(coverLayouts.length).toBeGreaterThanOrEqual(1);
    expect(coverLayouts.every((l) => l.role === 'cover')).toBe(true);
    expect(coverLayouts.every((l) => l.theme === 'theme01')).toBe(true);
  });

  it('should list layouts by theme', () => {
    const themeLayouts = listLayoutsByTheme('theme01');
    expect(themeLayouts.length).toBeGreaterThanOrEqual(23);
  });
});
