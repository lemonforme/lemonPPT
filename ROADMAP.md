# lemonPPT 路线图

> 本文档面向用户与贡献者，概述 lemonPPT 的当前状态与未来规划。
> 项目采用 [AGPL-3.0](LICENSE) 开源协议。

---

## 当前状态（v0.2.0）

lemonPPT 已完成商业上线所需的版式、主题与导出能力储备：

- **10 套原创主题**：theme01 ~ theme10，每套均支持多种色彩方案与外观模式。
- **802 个注册版式**：覆盖 23 个页面角色（封面、目录、指标、图表、对比、流程、时间线、路线图、团队、价格、SWOT、PEST、结尾等）。
- **三套导出路径**：HTML 在线编辑、PPTX（pptxgenjs）、PDF（Playwright）。
- **CLI / API / Agent Skill**：`@lemonppt/cli` 已发布，支持 `generate / render / export / serve` 等子命令，并可通过 `install-skill` 安装到 Claude / Codex / Cursor。
- **自动化验证**：版式导出审计（`audit:layouts`）、视觉回归快照（`snapshot` / `regression`）、Agent smoke test（`agent:test`）。

> 详细内部规划见 `docs/plans/`；进度日志见 `docs/progress.md`。

---

## 已完成的里程碑

| 版本 | 时间 | 关键产出 |
|---|---|---|
| v0.1.0 | 2026-07 初 | 首个可运行 MVP：共享版式 + theme01 + CLI 雏形。 |
| v0.1.6 | 2026-07-19 | 完成 MIT → AGPL-3.0 协议切换；建立 CLA / 贡献指南 / 行为准则。 |
| v0.1.7 | 2026-07-20 | 55 个版式 PPTX 导出全覆盖；Gallery + 视觉回归基线；本地 Agent smoke test 通过。 |
| **v0.2.0** | **2026-08** | **主题扩展至 10 套，版式扩展至 802 个；theme07~theme10 完成专属渲染器与角色映射；README / SKILL 文档同步。** |

---

## 后续规划

### v0.3.0 — 编辑器体验与性能

- 统一单页编辑器架构，所有主题共享同一 editor 页面，按 `goal.theme` 动态加载主题样式。
- 优化幻灯片切换与 ECharts 重初始化策略，减少切页闪烁。
- 引入 `skipMotion` 参数，区分切页动画与参数调参时的过渡行为。
- 完善撤销/重做与自动保存策略。

### v0.4.0 — 生成质量与 Agent 体验

- 基于真实 Agent 平台（Claude / Codex / Cursor）实测反馈迭代 `SKILL.md`。
- 优化自然语言 → `goal.json` 的生成质量，提升版式与主题匹配准确度。
- 扩展 fallback 示例库，覆盖更多行业场景。

### v0.5.0 — 社区与生态

- 开放外部 Pull Request（需签署 CLA）。
- 补齐 GitHub Actions CI/CD：build / test / lint / typecheck / regression。
- 发布示例 PPTX 与在线 gallery 页面。
- 评估是否拆分独立的 `@lemonppt/skill` 包。

### 远期方向（未排期）

- 版式脚手架持续优化，目标 30 分钟内完成一个新版式。
- 主题脚手架，让新增主题无需重写版式组件。
- 多语言字体与排版优化（中文、日文、阿拉伯文等）。
- 在线协作与版本管理（需重新评估架构）。

---

## 如何参与

- 反馈问题：提交 [GitHub Issue](https://github.com/lemonforme/lemonPPT/issues)。
- 贡献代码：阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 与 [CLA.md](CLA.md)。
- 使用 skill：`npx @lemonppt/cli install-skill`。

---

*最后更新：2026-08-17*
