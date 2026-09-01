# Debug Session: theme11-chart-insight-editor

## Status
[CLOSED]

## Symptoms
- 画廊和 editor 页面看不到图表说明面板（ChartInsightPanel）的改动。
- 图表数值在 editor 中更改后不生效或显示错乱。
- `theme11_chart_parallel_v1` 图表显示错乱。
- 数组字段减少条目再增加后，新增条目空白且无法编辑文字。
- 右侧很多属性修改后不生效。

## Root Causes & Fixes

### 1. 图表说明面板未统一集成
- **原因**：`chart-bar-v1`、`chart-line-v1`、`chart-area-v1`、`chart-stack-v1`、`chart-grouped-v1`、`chart-hbar-v1`、`chart-donut-v1`、`chart-pie-v1`、`chart-radar-v1`、`chart-gauge-v1` 等组件没有引入 `ChartInsightPanel`，schema 中也没有 `insight*` 字段，导致面板不显示、右侧属性缺失。
- **修复**：为所有 theme11 chart 组件统一补充 `ChartInsightPanel` 渲染与 `chartInsightSchema(...)` schema 字段，并移除数据字段上的 `inlineEditable: true`，让右侧属性面板正常展示所有可编辑项。
- **关键改动**：`packages/templates/src/themes/theme11/chart-*-v1.tsx`

### 2. 右侧很多属性不生效
- **原因**：schema 中的字段（包括标题、数值、数组项等）大多标记了 `inlineEditable: true`。`editor-script.ts` 的 `renderSchemaFields` 会跳过这些字段不在右侧面板渲染，用户只能在画布上 inline 编辑；但 canvas 可编辑元素与右侧面板字段存在重复/遗漏，导致“很多属性无法生效”。
- **修复**：在 theme11 所有 chart schema 中移除数据字段的 `inlineEditable: true`（标题、栏标等仍保留 inline 编辑能力，但也会出现在右侧）。简单字段统一进入右侧面板后，`setField` 能正确回写 slide props 并触发画布刷新。

### 3. `theme11_chart_parallel_v1` 图表错乱
- **原因**：`t11ParallelOption` 中 `parallelAxis` 的 `dim` 全部硬编码为 `0`，导致多个维度重叠在一条纵轴上。
- **修复**：改为 `dim: i`，让每个维度正确映射到独立坐标轴。
- **关键改动**：`packages/templates/src/themes/theme11/t11echart.tsx`

### 4. 数组字段新增条目空白
- **原因**：`editor-script.ts` 的 `getSchemaEmptyItem` 对 `text` 类型字段返回空字符串；且数组子字段若全是 text/textarea/image 时被判定为“可在画布上编辑”，导致右侧面板不展示子字段，新增空白条目无法修改。
- **修复**：
  - `getSchemaEmptyItem` 中 `text` 类型默认值改为 `"示例文字"`。
  - `createSchemaArraySection` 中 `allSubFieldsAreCanvasEditable` 直接置为 `false`，数组子字段始终显示在右侧面板。
- **关键改动**：`packages/renderer/src/editor-script.ts`

### 5. 类目数组默认值与 itemSchema 不一致
- **原因**：`categories`/`labels` 数组的 `itemSchema` 使用 `{ key: 'text' }`，但 `defaultValue` 是字符串数组，导致右侧面板中类目输入框初始为空。
- **修复**：将 `chart-bar-v1`、`chart-line-v1`、`chart-area-v1`、`chart-stack-v1`、`chart-grouped-v1`、`chart-hbar-v1` 的 `categories` 默认值改为 `{ text: '...' }` 对象数组。
- **关键改动**：`packages/templates/src/themes/theme11/chart-*-v1.tsx`

## Evidence (Post-fix)
- 重新生成 mock goal：`examples/theme11-insight-mock-goal.json`（22 个 chart slides）。
- 重新渲染 editor：`output/theme11-insight/editor.html`；画廊：`output/gallery/theme11/index.html`。
- Playwright 验证脚本：`scripts/verify-theme11-editor.mjs` 生成截图到 `output/theme11-verification/`。
- 所有 22 个 chart slide 的 DOM 检查均显示 `.lp-theme11-chart-side` 说明面板已渲染（`check-theme11-panels`）。
- 平行坐标图 SVG 中 5 个维度标签（性价比/性能/稳定性/易用性/扩展性）各出现 1 次，不再重叠。
- 柱状图 `values` 字段在右侧面板修改后，slide props 从 `24,38,52,67` 变为 `99,88,77,66`。
- 类目数组从 4 减到 2 再增加到 4 后，新增条目为 `{ text: "示例文字" }`，可直接编辑。
- 浏览器 console 无报错。

## Verification Commands
```bash
# 构建
npx pnpm --filter @lemonppt/templates build
npx pnpm --filter @lemonppt/renderer build
npx pnpm --filter @lemonppt/cli build

# 生成 mock 与画廊
node scripts/gen-theme11-mock.mjs
node scripts/gallery.mjs
node packages/cli/dist/cli.js render examples/theme11-insight-mock-goal.json --out ./output/theme11-insight --editable

# 自动化验证
node scripts/verify-theme11-editor.mjs
```

## Files Changed
- `packages/templates/src/themes/theme11/t11echart.tsx`
- `packages/templates/src/themes/theme11/chart-*-v1.tsx`（全部 22 个图表组件）
- `packages/renderer/src/editor-script.ts`
- `packages/renderer/src/client-render.ts`（已清理调试插桩）
- `scripts/verify-theme11-editor.mjs`
- `examples/theme11-insight-mock-goal.json`
- `output/theme11-insight/editor.html`
- `output/gallery/theme11/index.html`

## Cleanup
- 已移除 `client-render.ts`、`editor-script.ts`、`t11echart.tsx` 中的调试 `fetch` 插桩。
- 已删除一次性脚本：`apply-theme11-chart-insight.mjs`、`dump-editor-fields.mjs`、`dump-parallel-dom.mjs`、`check-theme11-panels.mjs`、`check-theme11-edit.mjs`、`check-parallel-chart.mjs`。
