// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, it } from 'vitest';
import { TimelineV2, timelineV2Meta } from './timeline-v2.js';

describe('timeline_v2', () => {
  it('should have correct meta', () => {
    expect(timelineV2Meta.id).toBe('timeline_v2');
    expect(timelineV2Meta.role).toBe('timeline');
  });

  it('should render with title and milestones', () => {
    const result = TimelineV2({
      title: '项目里程碑',
      kicker: '发展历程',
      milestones: [
        { date: '2026 Q1', title: '立项', description: '确定产品方向' },
        { date: '2026 Q2', title: 'MVP', description: '完成核心功能' },
      ],
    });
    expect(result).toBeDefined();
  });

  it('should render without milestones', () => {
    const result = TimelineV2({ title: '空时间线' });
    expect(result).toBeDefined();
  });
});
