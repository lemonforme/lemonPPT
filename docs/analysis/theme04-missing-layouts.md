# theme04 与 Dashi PPT 缺失版式对照清单与下一步计划

> 基于 `docs/analysis/dashi-theme04-analysis.md` 与当前 `packages/templates/src/themes/theme04/` 实现状态整理。
> 设计红线不变：不复制 Dashi theme04 的色值、类名、slot 结构与运行时代码；仅借鉴「多色切换 / 关键词高亮 / 杂志化排版 / 玻璃拟态」等设计思路。

---

## 一、当前实现状态

截至今日，theme04 已累计实现 **75 个版式**，并完成：

| 接入项 | 状态 |
|---|---|
| `packages/templates/src/registry.tsx` 注册 | ✅ 75/75 |
| `packages/renderer/src/export-pptx.ts` PPTX 导出 | ✅ 75/75 |
| `scripts/lib/sample-props.mjs` 示例数据 | ✅ 75/75 |
| `packages/composer/src/index.ts` 角色候选映射 | ✅ 已覆盖 |
| 4 色调切换（green / yellow / blue / pink） | ✅ `tokens.ts` + `render.tsx` 已支持 |
| light / dark 双外观 | ✅ 已支持 |
| theme04 编辑器示例页 | ✅ `examples/theme04-goal.json` 含 75 页，`output/theme04-editor.html` 已重新生成 |

> 注：Dashi theme04 的 74 个独立 slot 已全覆盖；theme04 现有 75 个版式，含 1 个额外扩展版式。

### 1.1 已实现的 75 个版式

完整版式清单见 `packages/templates/src/themes/theme04/`。核心批次如下：

- **首批 8 个 MVP 版式**：cover_v1、chapter_v1、content_v1、metric_v1、chart_v1、quote_v1、image_v1、closing_v1
- **Phase 1（12 个）**：cover_ghost_v1、cover_bento_v1、cover_magazine_v1、chapter_split_v1、chapter_numbered_v1、cards_v1、gauges_v1、delta_v1、versus_v1、trio_v1、polaroid_v1、verdict_v1
- **Phase 2（15 个）**：treemap_v1、scatter_v1、slope_v1、scoreboard_v1、scorecards_v1、matrix_v1、waterfall_v1、groupbars_v1、layers_v1、region_v1、valuechart_v1、filmstrip_v1 等
- **Phase 3（9 个）**：annotated_v1、voices_v1、diptych_v1、riskchain_v1、metro_v1、dumbbell_v1、pyramid_v1、imagestory_v1、showcase_v1
- **Phase 4（9 个）**：cover_hero_v1、monthchart_v1、stacked_v1、calendar_v1、quartertable_v1、spread_v1、chaintable_v1、chainflow_v1、ledger_v1

| # | 版式 ID | role | 用途 | 对应 Dashi slot |
|---|---|---|---|---|
| 1 | `theme04_cover_v1` | cover | 居中主题封面 | page001 coverHero |
| 2 | `theme04_cover_index_v1` | cover | 索引导读封面 | page002 coverIndex |
| 3 | `theme04_chapter_v1` | content | 章节过渡页 | page008 section |
| 4 | `theme04_chapter_v2` | content | 章节大字页 | page035 chapter |
| 5 | `theme04_table_of_contents_v1` | tableOfContents | 图文目录 | page006 contents |
| 6 | `theme04_content_v1` | content | 胶囊高亮内容页 | page007 method |
| 7 | `theme04_feature_v1` | feature | 特性要点 | — |
| 8 | `theme04_metric_v1` | metric | 大数字指标 | page029 bignumber |
| 9 | `theme04_metric_big` | metric | 超大号指标 | — |
| 10 | `theme04_stats_v1` | metric | 三联/多指标卡 | page030 stattrio |
| 11 | `theme04_chart_v1` | chart | 柱状/折线图表 | page017 charts |
| 12 | `theme04_chart_donut` | chart | 环形占比图 | page010 donut |
| 13 | `theme04_radar_v1` | chart | 多维雷达图 | page049 radar |
| 14 | `theme04_heatmap_v1` | chart | 资金热力矩阵 | page021 heatmap |
| 15 | `theme04_ranking_v1` | ranking | 头部玩家排名 | page036 ranking |
| 16 | `theme04_table_v1` | table | 轮次结构表 | page024 table |
| 17 | `theme04_process_v1` | process | 流程步骤 | — |
| 18 | `theme04_timeline_v1` | timeline | 阶段策略时间线 | page068 timeline |
| 19 | `theme04_gantt_v1` | roadmap | 泳道甘特图 | page066 gantt |
| 20 | `theme04_roadmap_v1` | roadmap | 资本三段式路线图 | page065 roadmap |
| 21 | `theme04_bento_v1` | bento | 一图速览 Bento | page016 bento |
| 22 | `theme04_quadrant_v1` | chart | 选题四象限 | page043 quadrant |
| 23 | `theme04_comparison_v1` | content | 投资策略对比 | page062 compare |
| 24 | `theme04_agenda_v1` | tableOfContents | 研究框架/议程 | page005 agenda |
| 25 | `theme04_image_v1` | image | 图文焦点页 | page058 spotlight |
| 26 | `theme04_image_quote_v1` | quote | 图文金句 | page073 quoteimage |
| 27 | `theme04_gallery_v1` | gallery | 地区画廊 | page041 gallery |
| 28 | `theme04_triptych_v1` | gallery | 全幅三联 | page048 triptych |
| 29 | `theme04_editorial_v1` | content | 杂志式跨页 | page047 editorial |
| 30 | `theme04_case_v1` | content | 典型案例 | page050 case |
| 31 | `theme04_team_v1` | team | 团队/人物 | page051 profile |
| 32 | `theme04_quote_v1` | quote | 金句引用 | page071 manifesto |
| 33 | `theme04_closing_v1` | closing | 核心结论 | page074 statement |

---

## 二、与 Dashi PPT 74 页的覆盖对照

Dashi theme04 共 74 个独立 slot，当前 theme04 已覆盖 **74 个**，无缺失 slot。下面按业务类型分组列出最终覆盖状态。

### 2.1 封面类（已覆盖 6/6）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page001 | coverHero | 居中主题封面 | `theme04_cover_v1` | ✅ 已覆盖 |
| page002 | coverIndex | 索引导读封面 | `theme04_cover_index_v1` | ✅ 已覆盖 |
| page003 | coverGhost | 幽灵数字封面 | `theme04_cover_ghost_v1` | ✅ 已覆盖 |
| page004 | coverBento | 糖果速览封面 | `theme04_cover_bento_v1` | ✅ 已覆盖（与 `bento_v1` 内容页区分） |
| page044 | cover | 杂志封面 | `theme04_cover_magazine_v1` | ✅ 已覆盖 |
| page055 | hero | 大图封面 | `theme04_cover_hero_v1` | ✅ 已覆盖 |

### 2.2 目录 / 导航类（已覆盖 2/2）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page005 | agenda | 研究框架 | `theme04_agenda_v1` | ✅ 已覆盖 |
| page006 | contents | 图文目录 | `theme04_table_of_contents_v1` | ✅ 已覆盖 |

### 2.3 研究方法 / 文本类（已覆盖 2/2）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page007 | method | 研究方法 | `theme04_content_v1` | ✅ 已覆盖 |
| page046 | trio | 三强争霸 | `theme04_trio_v1` | ✅ 已覆盖 |

### 2.4 章节过渡类（已覆盖 4/4）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page008 | section | 章节页 | `theme04_chapter_v1` | ✅ 已覆盖 |
| page035 | chapter | 章节大字 | `theme04_chapter_v2` | ✅ 已覆盖 |
| page061 | split | 分屏章节 | `theme04_chapter_split_v1` | ✅ 已覆盖 |
| page069 | numbered | 极简编号章节 | `theme04_chapter_numbered_v1` | ✅ 已覆盖 |

### 2.5 市场 / 赛道分布类（已覆盖 3/3）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page009 | cards | 行业赛道 | `theme04_cards_v1` | ✅ 已覆盖 |
| page010 | donut | 赛道占比 | `theme04_chart_donut` | ✅ 已覆盖 |
| page013 | treemap | 资金版图 | `theme04_treemap_v1` | ✅ 已覆盖 |

### 2.6 排名 / 头部玩家类（已覆盖 4/4）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page011 | scatter | 估值散点 | `theme04_scatter_v1` | ✅ 已覆盖 |
| page012 | slope | 排名变迁 | `theme04_slope_v1` | ✅ 已覆盖 |
| page026 | scoreboard | 头部玩家对照表 | `theme04_scoreboard_v1` | ✅ 已覆盖 |
| page036 | ranking | 头部玩家 | `theme04_ranking_v1` | ✅ 已覆盖 |

### 2.7 数据 / 指标类（已覆盖 8/8）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page020 | gauges | 三重集中仪表盘 | `theme04_gauges_v1` | ✅ 已覆盖 |
| page021 | heatmap | 资金热力矩阵 | `theme04_heatmap_v1` | ✅ 已覆盖 |
| page028 | matrix | 能力对照矩阵 | `theme04_matrix_v1` | ✅ 已覆盖 |
| page029 | bignumber | 大数字 | `theme04_metric_v1` | ✅ 已覆盖 |
| page030 | stattrio | 三联大数字 | `theme04_stats_v1` | ✅ 已覆盖 |
| page031 | deltahero | 增长大数字 | `theme04_delta_v1` | ✅ 已覆盖 |
| page032 | scorecards | 资本计分卡 | `theme04_scorecards_v1` | ✅ 已覆盖 |
| page033 | versus | 对比双数字 | `theme04_versus_v1` | ✅ 已覆盖 |

### 2.8 时间序列 / 节奏类（已覆盖 7/7）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page014 | waterfall | 资金瀑布 | `theme04_waterfall_v1` | ✅ 已覆盖 |
| page017 | charts | 融资趋势 | `theme04_chart_v1` | ✅ 已覆盖 |
| page018 | monthchart | 月度趋势 | `theme04_monthchart_v1` | ✅ 已覆盖 |
| page019 | stacked | 季度资本构成 | `theme04_stacked_v1` | ✅ 已覆盖 |
| page022 | calendar | 资本月历 | `theme04_calendar_v1` | ✅ 已覆盖 |
| page023 | quartertable | 季度走势表 | `theme04_quartertable_v1` | ✅ 已覆盖 |
| page025 | spread | 资金消长 | `theme04_spread_v1` | ✅ 已覆盖 |

### 2.9 轮次 / 结构类（已覆盖 2/2）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page015 | groupbars | 半年对比柱 | `theme04_groupbars_v1` | ✅ 已覆盖 |
| page024 | table | 轮次结构表 | `theme04_table_v1` | ✅ 已覆盖 |

### 2.10 产业链 / 分层类（已覆盖 3/3）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page037 | layers | 产业链分层 | `theme04_layers_v1` | ✅ 已覆盖 |
| page038 | chaintable | 产业链分层表 | `theme04_chaintable_v1` | ✅ 已覆盖 |
| page039 | chainflow | 产业链分层·流向 | `theme04_chainflow_v1` | ✅ 已覆盖 |

### 2.11 地理 / 画廊类（已覆盖 3/3）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page040 | region | 地区分布 | `theme04_region_v1` | ✅ 已覆盖 |
| page041 | gallery | 地区画廊 | `theme04_gallery_v1` | ✅ 已覆盖 |
| page042 | filmstrip | 胶片印样 | `theme04_filmstrip_v1` | ✅ 已覆盖 |

### 2.12 矩阵 / 决策类（已覆盖 3/3）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page016 | bento | 一图速览 | `theme04_bento_v1` | ✅ 已覆盖 |
| page043 | quadrant | 选题四象限 | `theme04_quadrant_v1` | ✅ 已覆盖 |
| page049 | radar | 多维雷达 | `theme04_radar_v1` | ✅ 已覆盖 |

### 2.13 估值类（已覆盖 3/3）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page052 | valuechart | 估值三级跳 | `theme04_valuechart_v1` | ✅ 已覆盖 |
| page053 | dumbbell | 估值跃迁 | `theme04_dumbbell_v1` | ✅ 已覆盖 |
| page054 | pyramid | 估值金字塔 | `theme04_pyramid_v1` | ✅ 已覆盖 |

### 2.14 图文 / 案例类（已覆盖 11/11）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page027 | ledger | 投资人出手榜 | `theme04_ledger_v1` | ✅ 已覆盖 |
| page046 | trio | 三强争霸 | `theme04_trio_v1` | ✅ 已覆盖 |
| page047 | editorial | 杂志式跨页 | `theme04_editorial_v1` | ✅ 已覆盖 |
| page048 | triptych | 全幅三联 | `theme04_triptych_v1` | ✅ 已覆盖 |
| page050 | case | 典型案例 | `theme04_case_v1` | ✅ 已覆盖 |
| page051 | profile | 人物档案卡 | `theme04_team_v1` | ✅ 已覆盖 |
| page056 | annotated | 标注特写 | `theme04_annotated_v1` | ✅ 已覆盖 |
| page057 | imagestory | 图片故事 | `theme04_imagestory_v1` | ✅ 已覆盖 |
| page058 | spotlight | 焦点特写 | `theme04_image_v1` | ✅ 已覆盖 |
| page059 | showcase | 焦点机位 | `theme04_showcase_v1` | ✅ 已覆盖 |
| page060 | polaroid | 拍立得拼贴 | `theme04_polaroid_v1` | ✅ 已覆盖 |

### 2.15 策略 / 结论类（已覆盖 13/13）

| Dashi 页码 | slot | 中文标签 | theme04 对应版式 | 状态 |
|---|---|---|---|---|
| page045 | coversection | 图背章节页 | `theme04_chapter_split_v1` | ✅ 已覆盖 |
| page062 | compare | 投资策略 | `theme04_comparison_v1` | ✅ 已覆盖 |
| page063 | diptych | 叙事对兑现 | `theme04_diptych_v1` | ✅ 已覆盖 |
| page064 | riskchain | 风险传导 | `theme04_riskchain_v1` | ✅ 已覆盖 |
| page065 | roadmap | 资本三段式 | `theme04_roadmap_v1` | ✅ 已覆盖 |
| page066 | gantt | 泳道甘特 | `theme04_gantt_v1` | ✅ 已覆盖 |
| page067 | metro | 资本地铁线 | `theme04_metro_v1` | ✅ 已覆盖 |
| page068 | timeline | 阶段策略 | `theme04_timeline_v1` | ✅ 已覆盖 |
| page070 | voices | 投资人说 | `theme04_voices_v1` | ✅ 已覆盖 |
| page071 | manifesto | 宣言金句 | `theme04_quote_v1` | ✅ 已覆盖 |
| page072 | verdict | 论断印章 | `theme04_verdict_v1` | ✅ 已覆盖 |
| page073 | quoteimage | 图文金句 | `theme04_image_quote_v1` | ✅ 已覆盖 |
| page074 | statement | 核心结论 | `theme04_closing_v1` | ✅ 已覆盖 |

---

## 三、版式补齐阶段总结

Dashi theme04 全部 74 个 slot 已实现对应版式，lemonPPT theme04 当前共 75 个版式。下面是各阶段完成情况：

### Phase 1：高复用基础版式（12 个）✅ 已完成

| 序号 | 版式 ID | role | 参考 Dashi slot |
|---|---|---|---|
| 1 | `theme04_cover_ghost_v1` | cover | page003 coverGhost |
| 2 | `theme04_cover_bento_v1` | cover | page004 coverBento |
| 3 | `theme04_cover_magazine_v1` | cover | page044 cover |
| 4 | `theme04_chapter_split_v1` | content | page061 split |
| 5 | `theme04_chapter_numbered_v1` | content | page069 numbered |
| 6 | `theme04_cards_v1` | feature | page009 cards |
| 7 | `theme04_gauges_v1` | metric | page020 gauges |
| 8 | `theme04_delta_v1` | metric | page031 deltahero |
| 9 | `theme04_versus_v1` | metric | page033 versus |
| 10 | `theme04_trio_v1` | content | page046 trio |
| 11 | `theme04_polaroid_v1` | gallery | page060 polaroid |
| 12 | `theme04_verdict_v1` | closing | page072 verdict |

### Phase 2：数据可视化版式（15 个）✅ 已完成

| 序号 | 版式 ID | role | 参考 Dashi slot |
|---|---|---|---|
| 13 | `theme04_treemap_v1` | chart | page013 treemap |
| 14 | `theme04_scatter_v1` | chart | page011 scatter |
| 15 | `theme04_slope_v1` | chart | page012 slope |
| 16 | `theme04_scoreboard_v1` | ranking | page026 scoreboard |
| 17 | `theme04_scorecards_v1` | metric | page032 scorecards |
| 18 | `theme04_matrix_v1` | chart | page028 matrix |
| 19 | `theme04_waterfall_v1` | chart | page014 waterfall |
| 20 | `theme04_groupbars_v1` | chart | page015 groupbars |
| 21 | `theme04_layers_v1` | process | page037 layers |
| 22 | `theme04_region_v1` | chart | page040 region |
| 23 | `theme04_filmstrip_v1` | gallery | page042 filmstrip |
| 24 | `theme04_valuechart_v1` | chart | page052 valuechart |
| 25 | `theme04_annotated_v1` | image | page056 annotated |
| 26 | `theme04_voices_v1` | quote | page070 voices |
| 27 | `theme04_diptych_v1` | content | page063 diptych |

### Phase 3：创意排版与策略版式（9 个）✅ 已完成

| 序号 | 版式 ID | role | 参考 Dashi slot |
|---|---|---|---|
| 28 | `theme04_dumbbell_v1` | chart | page053 dumbbell |
| 29 | `theme04_pyramid_v1` | chart | page054 pyramid |
| 30 | `theme04_imagestory_v1` | image | page057 imagestory |
| 31 | `theme04_showcase_v1` | image | page059 showcase |
| 32 | `theme04_riskchain_v1` | process | page064 riskchain |
| 33 | `theme04_metro_v1` | process | page067 metro |
| 34 | `theme04_annotated_v1` | image | page056 annotated |
| 35 | `theme04_voices_v1` | quote | page070 voices |
| 36 | `theme04_diptych_v1` | content | page063 diptych |

### Phase 4：低优先级剩余版式（9 个）✅ 已完成

| 序号 | 版式 ID | role | 参考 Dashi slot |
|---|---|---|---|
| 37 | `theme04_cover_hero_v1` | cover | page055 hero |
| 38 | `theme04_monthchart_v1` | chart | page018 monthchart |
| 39 | `theme04_stacked_v1` | chart | page019 stacked |
| 40 | `theme04_calendar_v1` | chart | page022 calendar |
| 41 | `theme04_quartertable_v1` | table | page023 quartertable |
| 42 | `theme04_spread_v1` | chart | page025 spread |
| 43 | `theme04_chaintable_v1` | table | page038 chaintable |
| 44 | `theme04_chainflow_v1` | process | page039 chainflow |
| 45 | `theme04_ledger_v1` | table | page027 ledger |

> 注：全部 75 个版式均已完成组件实现、样式、注册、PPTX 导出、示例数据、角色候选映射与快照生成。

---

## 四、下一步执行计划

### Phase 1：补齐高复用基础版式（目标：12 个新 slot）✅ 已完成

**预期结果**：theme04 版式数从 33 → 45，覆盖封面、章节、指标、图文、结论等核心场景。当前已全部实现。

实现顺序建议：

1. `theme04_cover_ghost_v1`（幽灵数字封面）
2. `theme04_cover_bento_v1`（Bento 速览封面）
3. `theme04_cover_magazine_v1`（杂志封面）
4. `theme04_chapter_split_v1`（分屏章节）
5. `theme04_chapter_numbered_v1`（极简编号章节）
6. `theme04_cards_v1`（行业赛道卡片）
7. `theme04_gauges_v1`（三重仪表盘）
8. `theme04_delta_v1`（增长大数字）
9. `theme04_versus_v1`（对比双数字）
10. `theme04_trio_v1`（三强争霸）
11. `theme04_polaroid_v1`（拍立得拼贴）
12. `theme04_verdict_v1`（论断印章）

每新增一个版式，同步完成：
- `packages/templates/src/themes/theme04/<slot>-v1.tsx`
- `packages/themes/src/theme04/styles.css` 对应样式
- `packages/templates/src/registry.tsx` 注册
- `packages/renderer/src/export-pptx.ts` PPTX 导出函数
- `scripts/lib/sample-props.mjs` 示例数据
- `packages/composer/src/index.ts` 角色候选映射（如适用）

### Phase 2：扩展数据可视化版式（目标：10-12 个新 slot）✅ 已完成

重点补齐 Dashi 中大量缺失的图表/排名/产业链类 slot，当前已全部实现：

- `theme04_treemap_v1`、`theme04_scatter_v1`、`theme04_slope_v1` ✅
- `theme04_scoreboard_v1`、`theme04_scorecards_v1`、`theme04_matrix_v1` ✅
- `theme04_waterfall_v1`、`theme04_groupbars_v1` ✅
- `theme04_layers_v1`、`theme04_region_v1` ✅
- `theme04_valuechart_v1`、`theme04_filmstrip_v1` ✅

### Phase 3：扩展创意排版与策略版式（目标：8-10 个新 slot）✅ 已完成

- `theme04_annotated_v1`、`theme04_voices_v1`、`theme04_diptych_v1` ✅
- `theme04_riskchain_v1`、`theme04_metro_v1` ✅
- `theme04_dumbbell_v1`、`theme04_pyramid_v1` ✅
- `theme04_imagestory_v1`、`theme04_showcase_v1` ✅

本阶段 9 个版式已全部实现、注册、导出并生成快照。

### Phase 4：回归测试与视觉优化 ✅ 已完成

1. ✅ 为所有新增版式生成快照：`node scripts/snapshot.mjs theme04` — 75 个版式截图全部生成。
2. ✅ 检查每个版式在 light / dark 模式与 4 种 tone 下的表现 — 编辑器支持实时切换。
3. ✅ 修复样式 bug（占位图、对齐、颜色对比度）— 随各批次实现时同步修复。
4. ✅ 更新 `examples/theme04-goal.json` — 已扩展为 75 页完整示例 deck。
5. ✅ 运行全量类型检查与构建：`corepack pnpm -r typecheck && corepack pnpm -r build` — 全部通过。
6. ✅ 重新生成 theme04 编辑器页面：`node scripts/render-editor.mjs examples/theme04-goal.json output/theme04-editor.html`。

---

## 五、需要特别关注的问题

1. **多色调一致性**：Phase 1/2 的新组件必须继续使用 `--lp-accent` / `--lp-accent-2` / `--lp-accent-cool` 等变量，确保 green/yellow/blue/pink 切换时自动适配。
2. **Editor Chrome 不受主题影响**：编辑器顶部栏、右侧边栏保持统一样式，只有 slide 内容区使用 theme04 样式。
3. **inlineEditable 规范**：非图表组件的文本字段继续全部 `inlineEditable: true`，不在右侧边栏显示文本/textarea。
4. **数组字段对象化**：所有数组项使用 `{ label, value }` 或 `{ title, description }` 等明确结构，避免 `[object Object]`。
5. **PPTX 导出兜底**：复杂图表（treemap、scatter、waterfall）如果 pptxgenjs 原生支持有限，可先导出为简化形状/表格占位，后续迭代优化。

---

## 六、后续可选扩展方向

全部 Dashi theme04 slot 已补齐，后续可按产品需求进行以下可选增强：

1. **动态背景**：为 cover/chapter 页增加 gooey / moving gradient 的静态渐变替代方案。
2. **独立视觉回归**：为 theme04 增加专属 snapshot 回归测试脚本，定期比对版式截图。
3. **动画微交互**：在保持默认 `data-lp-transition="none"` 的前提下，为卡片、数字增加进入动画变体。
4. **新场景版式**：如需覆盖演讲、教育、电商等场景，可在 theme04 风格体系下新增版式。
