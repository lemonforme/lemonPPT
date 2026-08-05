# theme01 P1 版式扩展计划

> 状态：执行中  
> 启动日期：2026-07-22

## 目标

在 P0 补齐叙事闭环的基础上，增强 theme01 的数据表达能力，覆盖更多数据可视化场景。

## P1 扩展清单

| 版式 ID | role | 场景 | 核心结构 |
|---|---|---|---|
| `theme01_gantt_v1` | `timeline` | 甘特排期 | 横向时间条，展示阶段/任务/起止时间 |
| `theme01_trend_v1` | `chart` | 趋势图 | 折线图/面积图，多系列时间序列 |
| `theme01_ranking_v1` | `chart` | 排名条形图 | 横向条形 + 排名序号 + 数值 |
| `theme01_quadrant_v1` | `comparison` | 四象限分析 | 2x2 矩阵，每个象限一个卡片 |

## 技术实现 checklist

- [x] 创建 `packages/templates/src/themes/theme01/gantt-v1.tsx`
- [x] 创建 `packages/templates/src/themes/theme01/trend-v1.tsx`
- [x] 创建 `packages/templates/src/themes/theme01/ranking-v1.tsx`
- [x] 创建 `packages/templates/src/themes/theme01/quadrant-v1.tsx`
- [x] 在 `packages/templates/src/registry.tsx` 注册 4 个新版式
- [x] 在 `packages/renderer/src/export-pptx.ts` 注册 PPTX 渲染器
- [x] 在 `packages/themes/src/theme01/styles.css` 添加对应样式
- [x] 更新 `packages/cli/SKILL.md` 可用版式表
- [x] 运行完整验证闭环

## 验收标准

```bash
corepack pnpm -r build
corepack pnpm test
corepack pnpm audit:layouts   # 61 / 61 版式覆盖
corepack pnpm gallery
corepack pnpm snapshot
corepack pnpm regression
```
