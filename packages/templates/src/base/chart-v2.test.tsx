import { describe, expect, it } from 'vitest';
import { ChartV2, chartV2Meta } from './chart-v2.js';

describe('chart_v2', () => {
  it('should have correct meta', () => {
    expect(chartV2Meta.id).toBe('chart_v2');
    expect(chartV2Meta.role).toBe('chart');
  });

  it('should render multi-series chart', () => {
    const result = ChartV2({
      title: '季度增长对比',
      kicker: '核心数据',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        { label: '2024', data: [10, 25, 40, 60], color: '#3b82f6' },
        { label: '2025', data: [15, 35, 55, 80], color: '#10b981' },
      ],
    });
    expect(result).toBeDefined();
  });
});
