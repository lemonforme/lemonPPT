# lemonPPT 法律与协议说明

> 本文档为项目内部治理文件，用于说明 lemonPPT 的协议状态、依赖合规性与资产来源。

---

## 一、项目协议

lemonPPT 整体采用 **GNU Affero General Public License v3.0 (AGPL-3.0)**。

- 完整协议文本见项目根目录 [`LICENSE`](/LICENSE)。
- 所有源码文件均标注 `SPDX-License-Identifier: AGPL-3.0-or-later`。

### 1.1 AGPL-3.0 对你意味着什么

- 你可以自由使用、修改、分发 lemonPPT。
- 如果你将 lemonPPT **作为网络服务向第三方提供**（包括通过 AI Agent 调用），你必须向用户公开对应版本的完整源代码。
- 任何基于 lemonPPT 的修改版本也必须以 AGPL-3.0 发布。
- 详细信息请阅读 [`LICENSE`](/LICENSE) 原文。

---

## 二、独立性声明

lemonPPT 是独立开发的 AI 演示文稿生成工具：

- **无代码依赖**：未使用 Dashi PPT（dashi-ppt-skill）项目中的任何源码文件。
- **无资产依赖**：未使用 Dashi PPT 的主题、图标、动态背景、字体文件或图片素材。
- **架构独立**：JSON plan → React 渲染 → 静态 HTML → PPTX/PDF 导出属于通用设计模式，不受协议保护。
- **导出引擎独立**：lemonPPT 使用开源的 `pptxgenjs`（MIT）和 `playwright`（Apache-2.0 / BSD）实现导出，未使用 Dashi PPT 的专有导出引擎 `html-deck-to-pptx`。

本项目根 `package.json` 中的描述 `Independent from dashi-ppt-skill` 即表达此独立性。

---

## 三、依赖协议清单

lemonPPT 使用 pnpm workspace 管理依赖。根据 `pnpm licenses list` 的扫描结果，所有依赖均为宽松协议或弱 copyleft 协议，与 AGPL-3.0 兼容。

### 3.1 协议分布（截至 2026-07-20）

| 协议 | 数量 | 说明 |
|---|---|---|
| MIT | ~158 | 宽松协议，可自由使用 |
| Apache-2.0 | ~5 | 宽松协议，可自由使用 |
| ISC | ~8 | 宽松协议，可自由使用 |
| BSD-3-Clause | ~2 | 宽松协议，可自由使用 |
| MPL-2.0 | ~2 | 弱 copyleft，作为独立依赖使用，兼容 AGPL-3.0 |
| MIT OR GPL-3.0-or-later | ~1 | `jszip`，按 MIT 许可使用 |

### 3.2 核心依赖说明

| 依赖 | 协议 | 用途 |
|---|---|---|
| `react` / `react-dom` | MIT | UI 渲染 |
| `pptxgenjs` | MIT | PPTX 导出 |
| `playwright` | Apache-2.0 | PDF 导出 / 浏览器自动化 |
| `pdf-lib` | MIT | PDF 处理 |
| `express` | MIT | Web 服务 |
| `jszip` | MIT OR GPL-3.0-or-later | ZIP 处理 |
| `lightningcss` | MPL-2.0 | CSS 处理 |

---

## 四、资产来源

### 4.1 字体

lemonPPT 不随仓库分发字体文件。主题通过 CSS `font-family` 引用系统字体与开源网络字体：

- Inter（SIL OFL）
- JetBrains Mono（SIL OFL）
- Noto Sans SC（SIL OFL）
- Source Han Sans / 思源黑体（SIL OFL）
- PingFang SC、Microsoft YaHei（系统预装）

如需自托管字体，请从 Google Fonts、Fontshare 或 Adobe Fonts 官方渠道下载，并保留相应 LICENSE 文件。

### 4.2 图标与图片

- 当前仓库中**不包含**任何图标或图片文件。
- 版式中的图标使用 Unicode 字符或运行时可通过 URL 引用的外部图片。
- 未来添加 SVG 图标时，将优先使用 Lucide（MIT）、Heroicons（MIT）或原创图标。

### 4.3 动态背景

- 当前主题背景使用 CSS 渐变、网格图案与径向光晕实现，均为原创 CSS。
- 未使用任何 Unicorn Studio 场景 JSON 或第三方动态背景资产。

---

## 五、贡献与版权

### 5.1 当前策略

- **暂不接受外部 Pull Request**。
- 欢迎通过 GitHub Issue 提交建议、报告问题或讨论功能。
- 正式开放贡献前，会发布贡献者许可协议（CLA）流程。

### 5.2 版权归属

- 当前全部源码版权归属于项目作者 `lemonforme`。
- 未来接受外部贡献时，贡献者需签署 CLA，或将其贡献明确授权给项目维护者。

---

## 六、合规检查清单

- [x] 根目录 `LICENSE` 为 AGPL-3.0 全文
- [x] 所有 `package.json` 的 `license` 字段为 `AGPL-3.0`
- [x] 源码文件包含 SPDX 协议头
- [x] 依赖协议扫描完成，无强 copyleft 冲突
- [x] 无 Dashi PPT 代码或资产
- [x] `README.md`、`SKILL.md` 包含协议声明
- [x] `CONTRIBUTING.md` 说明当前不接受外部 PR
- [ ] 开放外部贡献前完成 CLA 流程

---

## 七、联系方式

如有关于协议或合规的疑问，请通过 GitHub Issue 联系项目维护者。

---

*最后更新：2026-07-20*
