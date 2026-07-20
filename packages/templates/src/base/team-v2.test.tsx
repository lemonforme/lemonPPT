// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { TeamV2, teamV2Meta } from './team-v2.js';

describe('team_v2', () => {
  it('should have correct meta', () => {
    expect(teamV2Meta.id).toBe('team_v2');
    expect(teamV2Meta.role).toBe('team');
  });

  it('should render with title', () => {
    const result = TeamV2({ title: '测试标题', kicker: '标签' });
    expect(result).toBeDefined();
  });
});
