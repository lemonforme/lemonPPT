// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { PricingV2, pricingV2Meta } from './pricing-v2.js';

describe('pricing_v2', () => {
  it('should have correct meta', () => {
    expect(pricingV2Meta.id).toBe('pricing_v2');
    expect(pricingV2Meta.role).toBe('pricing');
  });

  it('should render with title', () => {
    const result = PricingV2({ title: '测试标题', kicker: '标签' });
    expect(result).toBeDefined();
  });
});
