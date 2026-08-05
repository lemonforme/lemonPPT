# theme01 P2 版式扩展计划

> 状态：已完成  
> 启动日期：2026-07-22

## 目标

补充场景化内容页版式，覆盖风险研判、投资展望、地区/市场分布等商务分析场景。

## P2 扩展清单

| 版式 ID | role | 场景 | 说明 |
|---|---|---|---|
| `theme01_risk_v1` | `content` | 风险研判 | 风险列表 + 影响程度 + 应对策略 |
| `theme01_outlook_v1` | `content` | 投资展望 | 标题 + 趋势判断 + 行动建议 |
| `theme01_region_v1` | `content` | 地区/市场分布 | 多地区数据卡片 |

## 技术实现 checklist

- [ ] 创建 `packages/templates/src/themes/theme01/risk-v1.tsx`
- [ ] 创建 `packages/templates/src/themes/theme01/outlook-v1.tsx`
- [ ] 创建 `packages/templates/src/themes/theme01/region-v1.tsx`
- [ ] 在 `packages/templates/src/registry.tsx` 注册 3 个新版式
- [ ] 在 `packages/renderer/src/export-pptx.ts` 注册 PPTX 渲染器
- [ ] 在 `packages/themes/src/theme01/styles.css` 添加对应样式
- [ ] 更新 `packages/cli/SKILL.md` 可用版式表
- [ ] 运行完整验证闭环

## 验收标准

```bash
corepack pnpm -r build
corepack pnpm test
corepack pnpm audit:layouts   # 64 / 64 版式覆盖
corepack pnpm gallery
corepack pnpm snapshot
corepack pnpm regression
```
