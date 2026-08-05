# Dashi PPT 项目协议分析报告

> 遍历 Dashi PPT 项目，分析各组成部分的具体协议情况，为 lemonPPT 的合规开发提供参考。

---

## 一、项目整体协议：AGPL-3.0

### 1.1 根目录协议

- **文件**：`LICENSE`
- **协议**：GNU Affero General Public License v3.0（AGPL-3.0）
- **README 声明**：本项目采用 AGPL-3.0 开源，这是 OSI 认证开源协议中 copyleft 效力最强的一个。

### 1.2 AGPL 的核心影响

- 整个仓库代码（包括 themes、renderer、布局、样式、脚本）均受 AGPL-3.0 约束。
- 只要在网络服务中使用或分发修改版，就必须向用户公开完整源代码。
- 直接集成到 lemonPPT 会把 lemonPPT 也强制变为 AGPL-3.0。

---

## 二、例外：导出引擎是专有软件

### 2.1 位置

- `skills/dashi-ppt/project/packages/html-deck-to-pptx/LICENSE`
- `skills/dashi-ppt/project/packages/html-deck-to-pptx/package.json`

### 2.2 协议内容

- **Dashi PPT Export Engine — Proprietary License**
- Copyright (c) 2026 chuspeeism. All rights reserved.
- 仅授权作为 Dashi PPT skill 的组成部分使用。

### 2.3 明确禁止

- 单独提取、复制、再分发该导出引擎。
- 用于任何其他软件、产品或服务。
- 修改、逆向工程、创建衍生作品。

### 2.4 历史版本说明

- v0.2.7 及之前版本曾以 MIT 发布，但仅对历史版本有效，不适用于当前及后续版本。

---

## 三、依赖库协议情况

从 `skills/dashi-ppt/project/package.json` 的依赖看：

| 依赖 | 协议 | 备注 |
|---|---|---|
| `react` / `react-dom` | MIT | 安全 |
| `pptxgenjs` | MIT | 安全，lemonPPT 可直接使用 |
| `html-to-image` | MIT | 安全 |
| `pdf-lib` | MIT | 安全 |
| `esbuild` | MIT | 安全 |
| `tsx` | MIT | 安全 |
| `playwright-core` | Apache-2.0 | 安全 |
| `pngjs` | MIT | 安全 |
| `gsap` | GreenSock Standard "no charge" License | 专有，免费使用但有条件 |
| `jszip` | MIT OR GPL-3.0-or-later | 双许可，通常按 MIT 使用 |

### 结论

Dashi 的**依赖都是宽松协议或可免费使用的**，问题不在依赖，而在 Dashi 自己的代码和导出引擎。

---

## 四、资产协议情况

### 4.1 字体

- **位置**：`skills/dashi-ppt/project/assets/vendor/fonts/`
- **内容**：Anton、Archivo、Caveat、IBM Plex、Inter、JetBrains Mono、Newsreader、Space Grotesk、Space Mono 等。
- **来源**：大多来自 Google Fonts，通常遵循 SIL Open Font License 1.1，可以商用。
- **注意**：项目中未包含这些字体的 LICENSE 文件，按 OFL 要求通常需要保留版权声明。这是 Dashi 项目本身的合规瑕疵，不影响你单独从 Google Fonts 获取合法授权。

### 4.2 动态背景

- **位置**：`skills/dashi-ppt/project/assets/unicorn/`
- **内容**：Unicorn Studio 场景 JSON。
- **协议状态**：属于 Dashi 项目的原创/收集资产，受 AGPL 保护。
- **结论**：不能直接使用。

### 4.3 图标

- **位置**：
  - `skills/dashi-ppt/project/assets/social-icons/`
  - `skills/dashi-ppt/project/assets/ui-icons/`
- **内容**：自定义 SVG 图标。
- **协议状态**：无独立 LICENSE 文件，属于 Dashi 原创资产。
- **结论**：不能直接使用。

---

## 五、协议分层总结

| 层级 | 内容 | 协议 | 能否用于 lemonPPT |
|---|---|---|---|
| **根项目代码** | themes、renderer、布局、脚本、样式 | AGPL-3.0 | ❌ 不能 |
| **导出引擎** | `html-deck-to-pptx` | 专有 | ❌ 不能 |
| **依赖库** | React、pptxgenjs、pdf-lib 等 | MIT/Apache-2.0 | ✅ 可以 |
| **字体文件** | Google Fonts 自托管 | SIL OFL（需单独确认） | ⚠️ 需重新从官方下载并附 LICENSE |
| **动态背景** | Unicorn Studio JSON | Dashi 原创/AGPL | ❌ 不能 |
| **图标/SVG** | 社交图标、UI 图标 | Dashi 原创/AGPL | ❌ 不能 |

---

## 六、对 lemonPPT 的启示

### 6.1 可以复用的（无需担心协议）

- **技术选型**：React + TypeScript + Tailwind + pptxgenjs + Playwright，这些都是宽松协议。
- **架构思路**：JSON plan → React SSR → 静态 HTML → 导出，这是设计模式，不受协议保护。
- **依赖库**：可以直接使用 `pptxgenjs`、`pdf-lib`、`playwright` 等。

### 6.2 绝对不能碰的

- Dashi 的 theme 代码、CSS、布局结构。
- Dashi 的导出引擎。
- Dashi 的 Unicorn 背景 JSON。
- Dashi 的自定义 SVG 图标。
- Dashi 项目里的任何 `.jsx`、`.js`、`.css`、`.html` 文件。

### 6.3 需要谨慎处理的

- **字体**：不要从 Dashi 仓库复制字体文件。去 Google Fonts 或 Fontshare 官方重新下载，并保留 LICENSE。
- **图片素材**：Dashi 模板里可能用了特定图片占位，不要直接搬运。

---

## 七、结论

Dashi PPT 是 **AGPL-3.0 + 专有导出引擎** 的双层结构。它的依赖和工具链可以放心使用，但它的代码、主题、资产、导出引擎都不能用于 lemonPPT。

**lemonPPT 必须做到：独立写代码、独立设计主题、独立实现导出、独立准备资产。**
