// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { RoadmapV2, roadmapV2Meta } from './roadmap-v2.js';

describe('roadmap_v2', () => {
  it('should have correct meta', () => {
    expect(roadmapV2Meta.id).toBe('roadmap_v2');
    expect(roadmapV2Meta.role).toBe('roadmap');
  });

  it('should render with title', () => {
    const result = RoadmapV2({ title: '测试标题', kicker: '标签' });
    expect(result).toBeDefined();
  });
});
