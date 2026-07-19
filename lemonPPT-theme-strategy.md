# lemonPPT 主题系统建设方案

> 目标：让 lemonPPT 具备类似 Dashi PPT 的多主题能力，同时完全原创、可扩展、可复用。

---

## 一、Dashi PPT 的 theme01~theme12 是什么

Dashi 的 12 个主题不是简单的换色，而是 **12 套完整的设计系统**：

- 每套主题有独立的配色、字体、间距、圆角、阴影、动效风格。
- 每套主题包含 **70~110 个独立页面组件**（React + scoped CSS）。
- 同一内容在不同主题下会重新排版，不是简单换肤。
- 背后需要大量设计和前端开发工作。

例如 theme01「轻拟态风」的代码位于：
`skills/dashi-ppt/project/src/components/themes/theme01/`

---

## 二、lemonPPT 的正确建设路径

### 阶段 1：搭建主题基础设施

**1. 设计 Token 系统**

把视觉变量抽象出来，不要硬编码在组件里：

```ts
// packages/themes/src/types.ts
export interface Theme {
  id: string;
  name: string;
  colors: {
    bg: string;
    surface: string;
    text: string;
    textMuted: string;
    accent: string;
    accentSoft: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: { page: string; grid: string };
  borderRadius: string;
  shadows: Record<string, string>;
}
```

**2. Layout 与 Theme 解耦**

一个 Layout 组件接收 `theme` 作为 props，这样同一布局可以用不同主题：

```tsx
export function CoverV1({ theme, title, subtitle }: CoverProps) {
  return (
    <div style={{ background: theme.colors.bg, fontFamily: theme.fonts.body }}>
      <h1 style={{ color: theme.colors.text }}>{title}</h1>
    </div>
  );
}
```

**3. 主题注册表**

```ts
// packages/themes/src/registry.ts
import { minimalTheme } from './minimal';
import { neonTheme } from './neon';

export const themes = {
  minimal: minimalTheme,
  neon: neonTheme,
};
```

---

### 阶段 2：MVP 只做一个原创主题

先不要想 12 个主题，先原创 **1 个高质量主题 + 5~8 个布局**：

- 主题名：`minimal`（极简深色科技风）
- 布局：
  - `cover_v1`：封面
  - `toc_v1`：目录
  - `content_v1`：图文内容
  - `metric_v1`：大数字
  - `quote_v1`：金句/观点
  - `ending_v1`：封底/CTA

目标：能跑通生成 → 预览 → 导出完整流程。

---

### 阶段 3：新增主题的工业化方式

等基础设施稳定后，每新增一个主题只需要做三件事：

| 步骤 | 内容 |
|---|---|
| 1. 定义设计 Token | 配色、字体、间距、氛围关键词 |
| 2. 实现 5~8 个布局变体 | 复用布局结构，按新主题重新设计样式 |
| 3. 写 AI prompt 适配 | 让 AI 知道新主题适合什么内容、什么排版 |

示例：

```ts
export const neonTheme: Theme = {
  id: 'neon',
  name: '霓虹科技',
  colors: {
    bg: '#050505',
    text: '#e0e0e0',
    accent: '#00f0ff',
  },
  fonts: {
    heading: 'Orbitron, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  // ...
};
```

---

### 阶段 4：规模化到 12 个主题

要做到 Dashi 那种 12 主题 × 80 页的规模，需要：

1. **设计资产化**：每套主题先出 Figma/设计稿，再转代码。
2. **Layout 模板库**：定义 15~20 种通用页面结构（封面、目录、单图、双栏、三列、时间线、大数字等）。
3. **主题覆盖规则**：每个通用结构有 N 种主题变体。
4. **AI 辅助**：让 AI 根据主题风格自动选择配色、图片、排版密度。

---

## 三、lemonPPT 不能走的路

| ❌ 不要这样做 | 原因 |
|---|---|
| 直接复用 Dashi 的 theme01~theme12 代码 | 违反 AGPL，且 lemonPPT 计划 MIT/Apache-2.0 |
| 把 Dashi 的 CSS 改个类名就用 | 仍是衍生作品，许可证污染 |
| 搬运 Dashi 的配色、字体组合、动态背景 | 有侵权和授权风险 |
| 用 Dashi 的 Unicorn 场景 JSON | 属于 Dashi 项目资产 |

---

## 四、开发路线图

### 现在（MVP）

- 原创 1 个主题：`minimal` 深色科技风。
- 5 个布局：cover / toc / content / metric / ending。
- 跑通生成 → 预览 → PPTX 导出。

### 1~2 个月后

- 增加到 2~3 个主题：`minimal`、`neon`、`nature`。
- 每个主题 5~8 个布局。
- 主题切换功能做好。

### 3~6 个月后

- 建立布局模板库（15~20 种通用结构）。
- 每个新主题只需要为这些结构写样式变体。
- 引入 AI 根据主题风格自动配图、调色。

### 长期

- 主题数量达到 8~12 个。
- 支持用户自定义主题（上传 logo、选色板）。
- 可能引入社区投稿主题机制。

---

## 五、快速验证方案：双主题切换 Demo

如果你想低成本验证主题系统是否可扩展，建议先做一个双主题 demo：

1. 在 `packages/themes/src/` 下创建 `minimal.ts` 和 `neon.ts` 两个 Token 文件。
2. 同一个 `CoverV1` 组件接收不同 theme，展示两种视觉风格。
3. 在 goal.json 里加 `"theme": "minimal"` 或 `"theme": "neon"`。
4. 渲染两个 HTML 出来对比效果。

这样可以快速验证主题系统的扩展性，再决定是否继续投入更多主题。
