import { describe, expect, it } from 'vitest';
import { TestimonialV2, testimonialV2Meta } from './testimonial-v2.js';

describe('testimonial_v2', () => {
  it('should have correct meta', () => {
    expect(testimonialV2Meta.id).toBe('testimonial_v2');
    expect(testimonialV2Meta.role).toBe('testimonial');
  });

  it('should render with quote and metric', () => {
    const result = TestimonialV2({
      quote: '产品让我们的工作效率提升了 10 倍。',
      author: '张三',
      role: 'CTO',
      company: '某科技公司',
      metric: '10x',
      metricLabel: '效率提升',
    });
    expect(result).toBeDefined();
  });
});
