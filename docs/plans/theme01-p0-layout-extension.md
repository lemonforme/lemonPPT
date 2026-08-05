# theme01 P0 版式扩展计划

> 状态：已确认，执行中  
> 确认日期：2026-07-22

## 背景

`theme01` 当前已有 53 个版式，覆盖了封面、目录、内容、数据、图表、章节、对比、金句、结尾等基础类型。但完整 PPT 叙事链路中仍缺少结论页、附录、评分卡、banner 章节页等关键场景。

本次扩展聚焦 P0 优先级，补齐叙事闭环，提升 theme01 作为通用商务/路演主题的实用性。

## 设计原则

1. **不复制 Dashi 的 84 个独立组件**，只借鉴其布局类型规划思路。
2. **保持组件化 + props 驱动**：每个版式通过 props 控制内容，支持编辑模式与 PPTX 导出。
3. **统一命名**：版式 ID 为 `theme01_${role}_${vN}`，组件名为 `Theme01${PascalRole}V${N}`。
4. **样式一致**：复用 theme01 既有 token（`lp-card`、`lp-rise`、`lp-head`、`lp-pill` 等）。
5. **为多主题预留接口**：新增组件遵循统一注册、导出规范，便于后续 `theme02` 等主题参考。

## P0 扩展清单

| 版式 ID | role | 场景 | 核心结构 |
|---|---|---|---|
| `theme01_conclusion_v1` | `closing` | 结论页 | 标题 + 3 条核心结论 |
| `theme01_appendix_v1` | `content` | 附录/数据来源 | 标题 + 多行来源说明 |
| `theme01_scorecard_v1` | `metric` | 多维度评分卡 | 4~5 个维度 + 分数 + 进度条 |
| `theme01_chapter_v3` | `chapter` | banner 章节页 | 全宽背景图 + 章节标题 |

## 技术实现 checklist

- [x] 创建 `packages/templates/src/themes/theme01/conclusion-v1.tsx`
- [x] 创建 `packages/templates/src/themes/theme01/appendix-v1.tsx`
- [x] 创建 `packages/templates/src/themes/theme01/scorecard-v1.tsx`
- [x] 创建 `packages/templates/src/themes/theme01/chapter-v3.tsx`
- [x] 在 `packages/templates/src/registry.tsx` 注册 4 个新版式
- [x] 在 `packages/renderer/src/export-pptx.ts` 注册 PPTX 渲染器
- [x] 在 `packages/themes/src/theme01/styles.css` 添加对应样式
- [x] 更新 `packages/cli/SKILL.md` 可用版式表
- [x] 运行完整验证闭环

## 验收标准

```bash
corepack pnpm -r build
corepack pnpm test
corepack pnpm audit:layouts   # 57 / 57 版式覆盖
corepack pnpm gallery
corepack pnpm snapshot
corepack pnpm regression
```

全部通过即视为 P0 扩展完成。
