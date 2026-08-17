// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, it, expect } from 'vitest';

/**
 * 防漂移护栏。
 *
 * 背景：主题 Token 在仓库中存在两份实现：
 *   - packages/templates/src/themes/<theme>/tokens.ts  ← 渲染真源，renderer 经 @lemonppt/templates 实际调用
 *   - packages/themes/src/<theme>/tokens.ts            ← 镜像副本，供 getTheme() 元数据与已发布包 API
 *
 * 历史事故：theme08 浅色配色只改了镜像副本，改动完全不生效，且两份长期漂移。
 * 本测试比对两侧「实际生成的 CSS 变量文本」，只要产物一致即通过（允许注释/排版差异）。
 */

import * as t08Truth from './theme08/tokens.js';
// eslint-disable-next-line import/no-relative-packages
import * as t08Mirror from '../../../themes/src/theme08/tokens.js';

describe('主题 Token 双份同步护栏', () => {
  it('theme08: 真源与镜像生成的 CSS 变量完全一致', () => {
    const truth = t08Truth.generateTheme08CssVariablesWithSchemesAndAppearance();
    const mirror = t08Mirror.generateTheme08CssVariablesWithSchemesAndAppearance();

    if (truth !== mirror) {
      let i = 0;
      while (i < Math.min(truth.length, mirror.length) && truth[i] === mirror[i]) i++;
      throw new Error(
        'theme08 两份 tokens.ts 已漂移（生成的 CSS 变量不一致）。\n' +
          '渲染真源: packages/templates/src/themes/theme08/tokens.ts\n' +
          '镜像副本: packages/themes/src/theme08/tokens.ts\n' +
          `首个差异 @${i}:\n` +
          `  真源: ${JSON.stringify(truth.slice(Math.max(0, i - 40), i + 60))}\n` +
          `  镜像: ${JSON.stringify(mirror.slice(Math.max(0, i - 40), i + 60))}\n` +
          '请先修改真源，再同步:\n' +
          '  cp packages/templates/src/themes/theme08/tokens.ts packages/themes/src/theme08/tokens.ts',
      );
    }
    expect(truth).toBe(mirror);
  });

  it('theme08: 深浅两套外观均已生成且色值不同', () => {
    const css = t08Truth.generateTheme08CssVariablesWithSchemesAndAppearance();
    // 深色（primary）与浅色（muted）选择器都必须存在
    expect(css).toContain(':root[data-appearance="primary"][data-theme="obsidian-gold"]');
    expect(css).toContain(':root[data-appearance="muted"][data-theme="obsidian-gold"]');
    // 编辑器按钮使用 light/dark，别名必须存在，否则切换无效
    expect(css).toContain(':root[data-appearance="light"][data-theme="obsidian-gold"]');
    expect(css).toContain(':root[data-appearance="dark"][data-theme="obsidian-gold"]');
  });

  it('theme08: 浅色外观使用象牙暖白底而非旧的淡紫灰', () => {
    const light = t08Truth.getTheme08Tokens('muted');
    expect(light.colors.background.toUpperCase()).toBe('#FDFBF4');
    // 旧值 #EDEAF4 / #D98E00 不应再出现
    expect(light.colors.background.toUpperCase()).not.toBe('#EDEAF4');
    expect(light.colors.accent.toUpperCase()).not.toBe('#D98E00');
  });

  it('theme08: styles.css 引用的 --lp-inverse-panel 等变量已在 Token 中定义', () => {
    const css = t08Truth.generateTheme08CssVariablesWithSchemesAndAppearance();
    for (const v of ['--lp-inverse-panel:', '--lp-inverse-panel-ink:', '--lp-accent-bright:']) {
      expect(css, `${v} 未定义，styles.css 中的引用会失效`).toContain(v);
    }
  });
});
