# lemonPPT 与大师 PPT（Dashi PPT）进度对齐报告

> 内部文档，不上传公开。
> 日期：2026-07-20

## 一、对比结论概览

| 维度 | 大师 PPT（Dashi PPT） | lemonPPT 当前状态 | 差距 | 优先级 |
|---|---|---|---|---|
| 开源协议 | AGPL-3.0 + 专有导出引擎 | AGPL-3.0（已切换），全部自研 | ✅ 已对齐 | - |
| 主题数量 | 12 套主题 × 70~110 页/主题 | 3 套主题 × 50 个共享版式 + 5 个主题专属变体 | ⚠️ 数量差距大，但架构更轻量 | P2（暂停新增主题） |
| 页面角色 | 18 种 | 约 23 种（cover/tableOfContents/metric/chart/comparison/process/quote/closing/content/feature/swot/pest/testimonial/faq/pricing/gallery/image/partners/team/stats/timeline/roadmap） | ✅ 覆盖较全 | P1（按需补版式） |
| 导出引擎 | 专有 `html-deck-to-pptx` | 自研 `export-pptx.ts` + `export-pdf.ts` | ✅ 独立可控 | - |
| Agent 分发 | `npx dashi-ppt-skill`，独立 skill 包 | `npx @lemonppt/cli install-skill`，CLI 内置 | ⚠️ 形态不同，功能等价 | P1（决策是否拆独立 skill 包） |
| 动态背景/资产 | Unicorn Studio JSON、自定义 SVG 图标、自托管字体 | 无动态背景，使用系统字体 + CSS 变量 | ⚠️ 视觉丰富度不足 | P2 |
| 编辑器 | 浏览器端完整编辑 | 浏览器端基础编辑（受限约束） | ⚠️ 功能受项目约束限制 | P2（不突破约束） |
| npm 发布 | 已发布 | 已发布 0.1.6，待更新 0.1.7 | ⚠️ 版本落后当前代码 | P1 |
| CI / 自动化 | 未知 | 无 | ⚠️ 缺失 | P1 |
| 社区治理 | 未知 | CLA / CoC / CONTRIBUTING / 模板已创建 | ✅ 已闭环（workflow 待推送） | P1 |

## 二、关键差距与应对

### 1. 主题/版式规模

- **Dashi**：12 主题 × ~80 页 = 约 960 个独立页面组件。
- **lemonPPT**：3 主题 × 50 个共享版式 + 5 个主题专属变体，同一版式通过 CSS 变量适配多主题，实际代码量远小于 Dashi。
- **应对**：
  - 采用"共享版式 + 主题换肤 + 主题专属变体"混合架构，不复制 Dashi 的每主题独立组件模式。
  - 当前不新增主题，先把共享版式数量补到 50+，覆盖高频汇报场景。
  - 对重点主题的核心角色引入主题专属变体，验证 `(role, theme)` 二维索引。
  - 后续通过社区贡献扩展主题，每个新主题只需写 token + CSS，可选补充专属变体。

### 2. Agent 分发形态

- **Dashi**：独立 npm skill 包，`npx dashi-ppt-skill` 安装 `SKILL.md` + project 到 Agent 技能目录。
- **lemonPPT**：CLI 内置 `install-skill`，`npx @lemonppt/cli install-skill` 安装 `SKILL.md`。
- **应对**：
  - 功能已等价（都生成 goal.json、渲染、导出）。
  - Phase 5 增加一个决策任务：是否拆分独立 `@lemonppt/skill` 包。当前优先度不高，可作为 npm 发布后的可选项。

### 3. 动态背景与资产

- **Dashi**：Unicorn Studio 动态背景、自定义 SVG 图标、自托管多字体。
- **lemonPPT**：静态渐变背景、无自定义图标、系统字体回退。
- **应对**：
  - 这是视觉丰富度的主要差距，但非功能阻塞。
  - 列入 P2，在版式和 Agent 体验稳定后再投入。
  - 必须确保所有新增资产协议安全（SIL OFL 字体、CC0/MIT 图标、原创背景）。

### 4. 导出引擎

- **Dashi**：专有导出引擎，lemonPPT 不能复用。
- **lemonPPT**：自研 `export-pptx.ts` 已覆盖 39/39 版式，PDF 基于 Playwright 截图。
- **应对**：
  - 继续保持自研，定期运行 `pnpm audit:layouts` 确保覆盖。
  - 未来可考虑把 PPTX 导出拆成独立包 `@lemonppt/export-pptx`。

## 三、文档与规划对齐动作

已识别并修正以下文档矛盾/过期内容：

1. **`docs/plans/project-plan.md`**：协议从 MIT/Apache-2.0 改为 AGPL-3.0；版式目标更新为 50 个共享版式 + 5 个主题专属变体；目录结构更新；新增混合架构说明。
2. **`docs/plans/theme-architecture-evolution.md`**：合并原 theme-strategy.md 与 theme-production-guide.md；明确当前 3 主题/50 共享版式/5 主题专属变体状态；提出共享版式 + CSS 变量 + 主题专属变体混合架构；阶段 1/2/3 均标记已完成。
3. **`docs/plans/technical-plan.md`**：协议更新；架构更新为当前 workspace 结构；版式数量更新为 50 个共享版式 + 5 个主题专属变体；PPTX 导出映射说明更新为支持 `(role, theme)` 覆盖。
4. **`docs/analysis/phase-4-next-step-analysis.md`**：npm 版本 0.1.3 → 0.1.6；版式数 30 → 50+；测试数 47 → 102；标记 Phase 4 已完成。
5. **`docs/plans/phase-5-community-plan.md`**：增加 "Skill 包架构决策" 任务；更新各任务状态。
6. **`docs/progress.md`**：新增 "文档对齐" 记录，并持续更新阶段 2/3 完成情况。

## 四、下阶段优先事项

按当前对齐结果，建议 Phase 5 执行顺序：

1. **P1**：npm 0.1.7 发布（同步当前代码与文档）。
2. **P1**：GitHub Actions CI（build / test / agent-test / snapshot）。
3. **P1**：Skill 包架构决策（CLI 内置 vs 独立 `@lemonppt/skill`）。
4. **P2**：README 重写 + 示例 PPTX。
5. **P2**：按需补充高价值版式至 50+。
6. **P2**：动态背景 / 图标 / 字体资产（协议安全前提下）。

## 五、风险提醒

- **协议一致性**：所有 docs/plans 中旧版 MIT/Apache-2.0 表述已修正为 AGPL-3.0，避免外部贡献者产生误解。
- **数字同步**：后续每次新增版式/主题/发布后，需同步更新 project-plan、theme-architecture-evolution、technical-plan、progress 中的数字，防止再次过期。
