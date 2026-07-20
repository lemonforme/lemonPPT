// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { FeatureV2, featureV2Meta } from './feature-v2.js';

describe('feature_v2', () => {
  it('should have correct meta', () => {
    expect(featureV2Meta.id).toBe('feature_v2');
    expect(featureV2Meta.role).toBe('feature');
  });

  it('should render with title', () => {
    const result = FeatureV2({ title: '测试标题', kicker: '标签' });
    expect(result).toBeDefined();
  });
});
