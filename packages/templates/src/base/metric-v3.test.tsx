// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { MetricV3, metricV3Meta } from './metric-v3.js';

describe('metric_v3', () => {
  it('should have correct meta', () => {
    expect(metricV3Meta.id).toBe('metric_v3');
    expect(metricV3Meta.role).toBe('metric');
  });

  it('should render with title', () => {
    const result = MetricV3({ title: '测试标题', kicker: '标签' });
    expect(result).toBeDefined();
  });
});
