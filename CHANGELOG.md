# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2026-08-30

### Fixed

- 修复 editor 页面功能缺失问题：`editor.js` 在注入 `editor-script.js` 之前先加载 `client-render.js` 与 `theme-echarts.js`，使属性面板、缩略图切换、撤销/重做等交互恢复正常。
- 修复画布缩放按钮被边栏遮挡、位置不对的问题，补充 `.lp-editor-zoom-bar` 定位与 `z-index` 样式。
- 补齐右侧属性面板缺失的 CSS（`.lp-property-section`、`.lp-property-toggle`、`.lp-property-segmented`、`.lp-property-color-grid`、`.lp-property-slider-*`、`.lp-property-array`、`.lp-property-btn*` 等）。
- CLI 静态输出额外内嵌 `window.__lemonPPT_goal`，确保 `editor-script` 能直接读取目标数据。

## [1.0.1] - 2026-08-30

### Fixed

- 修复 editor 页面左侧缩略图不显示幻灯片预览且无法点击切换的问题，统一客户端与服务端渲染的缩略图 HTML 结构。
- 修复 editor 页面右侧属性面板缺少 `lp-property-content` 容器导致控件属性无法渲染的问题。
- 补充 editor.html 中缩略图预览所需的 CSS 样式，确保预览图、遮罩、标题和删除按钮正确叠放。

## [1.0.0] - 2026-08-30

### Added

- **lemonPPT 1.0 正式发布**：统一单页编辑器架构，所有主题共享同一个 editor 页面，按 `goal.theme` 动态加载主题样式。
- **外部 Agent 调用能力**：提供 Dashi / Codex / Claude / Cursor 风格的 Skill 包，支持通过 CLI 或 HTTP API 被外部 Agent 调用。
- **无 scope CLI 别名包 `lemonppt`**：除 `@lemonppt/cli` 外，新增可直接 `npm install -g lemonppt` / `npx lemonppt` 安装的别名包。
- **视觉回归测试**：新增版式画廊、主题快照、像素级 diff 与基线缓存机制。
- **端到端测试**：使用 Playwright 覆盖 editor 页面加载、主题切换与状态保留。
- **布局角色速查表**：自动生成 `references/layout-roles.md`，方便外部 Agent 选择版式。

### Changed

- 主题体系扩展为 `theme01` ~ `theme10`，统一视觉 tokens 与导出样式。
- `lemonppt serve` 启动真正的 API 服务（apps/server），支持 render / export / editor-data / stage-media 端点。
- 将 Playwright Chromium 安装提前到 CI 测试步骤之前，避免 PDF 导出测试因缺少浏览器而失败。
- 视觉回归 workflow 改为按主题并行截图，并在 `main` 分支 push 时自动更新基线。

### Removed

- 清理代码与文档中所有第三方竞品名称（`Dashi` / `dashi` / `大师`）的引用。
- 移除旧的 per-theme editor 生成路径，统一为单页 editor。

### Fixed

- 修复 `@lemonppt/cli` 在某些环境下 `package.json` 子路径无法解析的问题，`lemonppt` 别名包通过 `import.meta.resolve` 定位主入口。
- 修复视觉回归基线缺失时直接退出 1 的问题，首次运行自动用当前快照初始化基线。
- 修复 `regression.yml` 单 job 超时问题，将 10 个主题截图拆分为矩阵并行任务。

## [0.2.0] - 2026-08-19

### Added

- 统一编辑器与主题扩展骨架。
- Agent API（layout/props/validation）初版。
- 自托管字体资源（SIL OFL 1.1）。
- CI / CLA / regression 工作流。

## [0.1.6] - 2026-08-15

### Changed

- 切换到 AGPL-3.0 许可。
- 主题 tokens 与布局规模化重构。
