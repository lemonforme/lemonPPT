<!-- lemonPPT - AI-powered presentation generation -->
<!-- Copyright (c) 2026 lemonforme -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

# theme02 实现方案

> 本文档基于 `docs/analysis/theme02-analysis.md` 的设计思路与 theme01 的实现机制制定。
> theme02 为 lemonPPT 完全原创主题，不直接复制 Dashi PPT theme02 的 Token、类名、配色、布局或动效算法。

---

## 一、设计定位

| 维度 | 方案 |
|---|---|
| **主题 ID** | `theme02` |
| **显示名称** | `Theme 02` / `Neon Tech` |
| **风格** | 深色科技霓虹风（受 Dashi theme02 思路启发，完全原创） |
| **适用场景** | 科技发布会、AI/机器人/自动驾驶路演、创新项目展示 |
| **视觉关键词** | 深色底、柔和光晕、玻璃面板、微动效 |
| **配色方案** | 主方案 `neon` + 可选变体 `violet`，通过 CSS 变量覆盖切换 |
| **页数目标** | MVP 15-20 页；完整版 40-50 页（不追求 74 页，控制维护成本） |

---

## 二、原创 Token 系统

### 2.1 TypeScript Token

```ts
// packages/themes/src/theme02/tokens.ts
export const theme02Tokens = {
  id: 'theme02',
  displayName: 'Theme 02',
  description: '深色科技霓虹风，冷光质感',
  colors: {
    ink: '#eef3f1',
    ink2: 'rgba(238,243,241,0.72)',
    ink3: 'rgba(238,243,241,0.48)',
    accent: '#00e0b8',
    accent2: '#ff6b6b',
    accentCool: '#4d9fff',
    glow: '0, 224, 184',
    background: '#070b10',
    surface: 'rgba(255,255,255,0.06)',
    surfaceStrong: 'rgba(255,255,255,0.10)',
    border: 'rgba(255,255,255,0.10)',
    line: 'rgba(255,255,255,0.08)',
    shadow: '0 24px 80px rgba(0,0,0,0.45)',
    series: ['#00e0b8', '#ff6b6b', '#4d9fff', '#b18aff', '#ffd166', '#06d6a0', '#ef476f'],
  },
  fonts: {
    heading: '"Space Grotesk", "Noto Sans SC", system-ui, sans-serif',
    body: '"Noto Sans SC", "Space Grotesk", system-ui, sans-serif',
    mono: '"Space Mono", ui-monospace, monospace',
  },
  spacing: {
    pagePadding: '108px',
    sectionGap: '40px',
    elementGap: '20px',
    padTop: '92px',
    padBottom: '84px',
  },
  borderRadius: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  fontSize: {
    display: '88px',
    h1: '58px',
    h2: '42px',
    h3: '32px',
    body: '24px',
    bodySmall: '18px',
    caption: '14px',
  },
  effect: {
    glowBlur: 'blur(60px)',
    riseDistance: '18px',
    riseDuration: '0.6s',
  },
} as const;
```

### 2.2 CSS 变量与双配色方案

```css
/* packages/themes/src/theme02/styles.css */
:root {
  --lp-ink: #eef3f1;
  --lp-ink2: rgba(238,243,241,0.72);
  --lp-ink3: rgba(238,243,241,0.48);
  --lp-accent: #00e0b8;
  --lp-accent-2: #ff6b6b;
  --lp-accent-cool: #4d9fff;
  --lp-glow: 0, 224, 184;
  --lp-bg: #070b10;
  --lp-surface: rgba(255,255,255,0.06);
  --lp-surface-strong: rgba(255,255,255,0.10);
  --lp-border: rgba(255,255,255,0.10);
  --lp-line: rgba(255,255,255,0.08);
  --lp-shadow: 0 24px 80px rgba(0,0,0,0.45);
  --lp-font: "Noto Sans SC", "Space Grotesk", system-ui, sans-serif;
  --lp-font-mono: "Space Mono", ui-monospace, monospace;
  --lp-radius-small: 8px;
  --lp-radius-medium: 16px;
  --lp-radius-large: 24px;
}

[data-lp-scheme="violet"] {
  --lp-accent: #9b7bff;
  --lp-accent-2: #ff85a1;
  --lp-glow: 155, 123, 255;
}
```

---

## 三、目录结构

```
packages/themes/src/theme02/
├── tokens.ts          # Token 定义
└── styles.css         # 主题样式

packages/templates/src/themes/theme02/
├── cover-v1.tsx
├── cover-v2.tsx
├── table-of-contents-v1.tsx
├── metric-v1.tsx
├── metric-v2.tsx
├── content-v1.tsx
├── content-v2.tsx
├── chart-v1.tsx
├── comparison-v1.tsx
├── timeline-v1.tsx
├── process-v1.tsx
├── quote-v1.tsx
├── team-v1.tsx
├── closing-v1.tsx
└── feature-v1.tsx     # 阶段一 MVP 骨架
```

---

## 四、技术实现

### 4.1 注册表接入

与 theme01 完全一致，在 `packages/templates/src/registry.tsx` 中注册：

```ts
import { Theme02CoverV1, theme02CoverV1Meta } from './themes/theme02/cover-v1.js';

registerLayout({ meta: theme02CoverV1Meta, component: Theme02CoverV1 });
```

### 4.2 渲染层

`packages/renderer/src/render.tsx` 已按 `goal.theme` 加载 CSS：

```html
<link rel="stylesheet" href="./assets/${goal.theme || 'theme01'}.css">
```

新增 theme02 后自动生效，无需修改渲染逻辑。

### 4.3 CLI 资源复制

`packages/cli/src/index.ts` 的 `copyThemeAssets` 会自动复制：

```ts
const cssSource = resolvePackagePath('@lemonppt/themes', 'src', theme, 'styles.css');
```

theme02 按同样目录放置即可被复制到 `output/assets/theme02.css`。

### 4.4 PPTX 导出

`packages/renderer/src/export-pptx.ts` 需要为 theme02 的每个 role 注册渲染器：

```ts
registerPptxRoleRenderer('cover', 'theme02', renderTheme02Cover);
```

建议随版式逐步补充，工作量与 theme01 相同。

### 4.5 编辑器弹窗

弹窗从 `listLayouts()` 按当前 theme 过滤，theme02 注册后会自动出现在弹窗中。

---

## 五、版式范围

### 5.1 阶段一：MVP（15-20 个版式）

| role | 版式 | 数量 |
|---|---|---|
| cover | cover-v1, cover-v2 | 2 |
| tableOfContents | toc-v1 | 1 |
| metric | metric-v1, metric-v2 | 2 |
| content | content-v1, content-v2 | 2 |
| chart | chart-v1 | 1 |
| comparison | comparison-v1 | 1 |
| timeline | timeline-v1 | 1 |
| process | process-v1 | 1 |
| quote | quote-v1 | 1 |
| team | team-v1 | 1 |
| closing | closing-v1 | 1 |
| feature | feature-v1 | 1 |

### 5.2 阶段二：完整版（40-50 个版式）

补齐 theme01 当前覆盖的全部 27 个 role，每个 role 1-3 个变体。不追求 74 页，以降低维护成本。

---

## 六、开发阶段

| 阶段 | 内容 | 预估 |
|---|---|---|
| **阶段 1：Token + 骨架** | tokens.ts、styles.css、5 个核心版式、注册表接入 | 0.5-1 天 |
| **阶段 2：MVP 版式** | 补齐到 15-20 个版式，PPTX 渲染器同步 | 1-2 天 |
| **阶段 3：完整版式** | 扩展到 40-50 个版式，覆盖全部 role | 2-3 天 |
| **阶段 4：编辑器/导出打磨** | 编辑器弹窗、预览、PDF/PPTX 细节对齐 | 0.5-1 天 |

---

## 七、风险与红线

- ❌ 不能复用 Dashi theme02 的 `--gxn-` token、`.gxn-theme` 类名、具体色值、slot 命名、中文标签。
- ❌ 不能直接复制 ticket focus、aurora text、conic-gradient 光边、磁吸悬停等具体 CSS 算法。
- ✅ 可以借鉴的是：**深色霓虹主题的设计逻辑**、**双配色方案实现思路**、**动效分层策略**。
- ⚠️ 新增主题后，agent prompt、composer、snapshot 脚本都需要扩展 theme02 示例。
- ⚠️ PPTX 导出必须每个 role 单独注册 theme02 渲染器，否则导出会失败。
- ⚠️ 当前项目已将 `base` 通用版式池移除，新增主题必须为每个 role 提供专属版式，不能依赖通用兜底。
