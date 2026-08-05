# theme06 与 Dashi 大师 PPT 对齐计划

> 本文档记录 theme06（深色图谱风）与 Dashi 参考之间的视觉/版式差距审计结果，并给出后续对齐的优先级与实施建议。
> 最新更新：2026-08-04

---

## 1. 背景与目标

theme06 目前已经完成了 80+ 个版式的功能实现，覆盖封面、章节、目录、内容、指标、图表、行业专题、交易结构、联盟、算力、大额交易等关键页面类型，并已统一支持可选背景图与 PPTX 导出。

下一步目标是：**在功能完整的基础上，进一步缩小与 Dashi theme06 参考在版式结构、视觉层级、配色、信息密度等方面的差距**，使其达到可上线/可对标大师 PPT 的质感。

---

## 2. 已完成的对齐项（2026-08-04）

### 2.1 统一的背景图占位逻辑

- 为 80 个 theme06 子页面增加了可选 `imageUrl` 背景图字段与渲染层。
- 新增通用组件：
  - [`packages/templates/src/themes/theme06/slide-bg.tsx`](../../packages/templates/src/themes/theme06/slide-bg.tsx)
- 新增通用样式：
  - [`packages/themes/src/theme06/styles.css`](../../packages/themes/src/theme06/styles.css)（`.lp-theme06-slide-bg*`）
- PPTX 导出层统一处理背景图：
  - [`packages/renderer/src/export-pptx.ts`](../../packages/renderer/src/export-pptx.ts) `renderSlideToPptx`
- 已排除已有专属图片逻辑的版式：`theme06_cover_v1`、`theme06_chapter_v1`、`theme06_closing_v1`、`theme06_chapter_image_v1`。

### 2.2 瀑布图配色对齐 Dashi 风格

- React 组件：
  - [`packages/templates/src/themes/theme06/chart-waterfall-v1.tsx`](../../packages/templates/src/themes/theme06/chart-waterfall-v1.tsx)
  - 首柱、末柱使用 accent（电光青柠）。
  - 中间正向柱改为半透明灰 `rgba(255,255,255,0.16)`。
  - 中间负向柱改为柔和红 `rgba(232,93,78,0.65)`。
- PPTX 导出：
  - [`packages/renderer/src/export-pptx.ts`](../../packages/renderer/src/export-pptx.ts) `renderTheme06ChartWaterfallV1`
  - 同步将正向柱改为中灰，保持导出一致性。

### 2.3 验证

- `corepack pnpm -r typecheck` ✅
- `corepack pnpm -r build` ✅
- `node scripts/gallery.mjs theme06` + `node scripts/snapshot.mjs theme06` ✅
- 临时 PPTX 导出验证（带背景图）✅

---

## 3. 剩余差距审计（按优先级）

### 3.1 高优先级

| 版式/模块 | 当前状态 | Dashi 参考特征 | 建议方案 |
|---|---|---|---|
| **章节页 `theme06_chapter_v1`** | 空心描边大号数字，缺少顶部/右上角章节标签与底部标签按钮 | 实心填充大号数字；顶部 `[CH] CHAPTER 02`；右上角 `章节 / SECTION 02`；底部当前章节要点标签按钮 | 增加 `section`、`tags[]` 字段；新增实心数字样式或 `chapter-numbered-v2` |
| **内容页 `theme06_content_v1`** | 左侧标题 + 右侧 bullet 列表 + 结论卡 | 右侧是带大编号 01/02/03/04 的卡片列表，当前激活项用 accent 高亮 | 新增 `content-numbered-v1` 或在 `content-v1` 中支持 `variant: 'numbered-cards'` |
| **大图/高客单价页（metric-hero / big-number 等）** | 缺少右侧图片占位区与水平进度条 | 左侧大数字 + 子指标 + 水平进度条/色块；右侧有对角线条纹的 `DROP IMAGE` 占位区 | 增加 `imageUrl` 与 `bars[]` 字段；补齐对角线占位样式 |
| **亮色模式** | theme06 仅深色主题 | Dashi theme06 存在浅色背景页（如 page048） | theme06 增加 `light/dark` 外观切换（类似 theme03/theme04），工作量较大，需单独规划 |

### 3.2 中优先级

| 版式/模块 | 当前状态 | Dashi 参考特征 | 建议方案 |
|---|---|---|---|
| **卡片/列表细节** | 卡片为独立区块，缺少统一顶部线与底部标注 | 卡片常有顶部 1-2px accent 线；底部有元数据如 `5 项风险 / 5 RISKS`、`4 段 / FLOW` | 在 `.lp-theme06-card` 等通用类中增加顶部 accent 线；为相关版式增加 `meta`/`footnote` 字段 |
| **风险页 / 案例页结构** | `risk-v1`、`case-v1` 结构与 Dashi 差异较大 | 左侧编号风险/案例卡片，右侧主视觉 `DROP IMAGE` + 传导说明 | 属于版式级差异，建议新增 `risk-v2`、`case-v2` 重新设计 |
| **背景网格** | 当前为径向渐变背景 | Dashi 背景有极淡的竖线网格 | 新增可选 `.lp-theme06-bg-grid` 类或主题变量 |

### 3.3 低优先级

- 字体字重、动画节奏、特定装饰性箭头/徽章等细节。
- 页脚信息的英文双语标注（如 `5 RISKS`、`4 SEG`）。

---

## 4. 推荐的最小化下一步行动

如果希望尽快补齐最关键的视觉差距，建议按以下顺序执行：

1. **章节页结构对齐**（预计 1-2 小时）
   - 给 `theme06_chapter_v1` 增加 `section`、`tags[]`。
   - 提供实心数字样式或新增 `chapter-numbered-v2`。

2. **内容编号卡片列表**（预计 2-3 小时）
   - 新增 `content-numbered-v1`：左侧标题 + 右侧 01/02/03/04 卡片列表，支持高亮当前项。
   - 注册到 registry、sample-props、PPTX 导出。

3. **大图/高客单价页占位区**（预计 2-3 小时）
   - 在 `metric-hero` 或 `big-number` 中增加右侧 `imageUrl` + 底部 `bars[]`。
   - 补齐对角线条纹占位样式。

4. **卡片顶部线与底部元数据**（预计 1-2 小时）
   - 在通用卡片样式中增加顶部 accent 线。
   - 为风险/案例/流程等版式增加底部 `meta` 字段。

5. **亮色模式（单独规划）**
   - 评估是否必须。如果上线前不需要浅色页，可延后。

---

## 5. 相关文件索引

- 主题样式：[`packages/themes/src/theme06/styles.css`](../../packages/themes/src/theme06/styles.css)
- 主题 Tokens：[`packages/themes/src/theme06/tokens.ts`](../../packages/themes/src/theme06/tokens.ts)
- 版式组件：[`packages/templates/src/themes/theme06/`](../../packages/templates/src/themes/theme06/)
- 版式注册：[`packages/templates/src/registry.tsx`](../../packages/templates/src/registry.tsx)
- PPTX 导出：[`packages/renderer/src/export-pptx.ts`](../../packages/renderer/src/export-pptx.ts)
- 示例数据：[`scripts/lib/sample-props.mjs`](../../scripts/lib/sample-props.mjs)
- Dashi 参考截图：[`docs/analysis/theme06-all/screenshots/`](../../docs/analysis/theme06-all/screenshots/)
- Dashi 分析文档：[`docs/analysis/dashi-theme06-analysis.md`](../../docs/analysis/dashi-theme06-analysis.md)
